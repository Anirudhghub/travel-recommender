import React from "react";
import "./App.scss";
import { Form, AutoComplete, Button, DatePicker, Checkbox, Space } from "antd";
import dayjs, { Dayjs } from "dayjs";

const { RangePicker } = DatePicker;

export interface SuggestionFormValues {
  oneWayStartTime: Dayjs;
  oneWayEndTime: Dayjs;
  returnStartTime?: Dayjs;
  returnEndTime?: Dayjs;
  startLocation: string;
  endLocation: string;
  hasReturnJourney: boolean;
}

function App() {
  const [startOptions, setStartOptions] = React.useState([]);
  const [endOptions, setEndOptions] = React.useState([]);
  const [hasReturnJourney, setHasReturnJourney] = React.useState(false);
  const [form] = Form.useForm<SuggestionFormValues>();

  const searchLocation = (query: string) => {};

  const handleSelect = (
    value: string,
    field: "startLocation" | "endLocation"
  ) => {
    if (field === "startLocation") {
      form.setFieldsValue({
        startLocation: value,
      });
    } else {
      form.setFieldsValue({
        endLocation: value,
      });
    }
  };

  const handleReturnJourneyChange = (e: any) => {
    setHasReturnJourney(e.target.checked);
    if (!e.target.checked) {
      // Clear return journey fields when unchecked
      form.setFieldsValue({
        returnStartTime: undefined,
        returnEndTime: undefined,
      });
    }
  };

  const onFinish = (values: SuggestionFormValues) => {
    console.log("Form values:", values);
    // Handle form submission
  };

  const disabledDate = (current: Dayjs) => {
    // Disable dates before today
    return current && current < dayjs().startOf("day");
  };

  return (
    <div className="App">
      <div className="app-header">Travel Recommendations</div>
      <Form
        form={form}
        onFinish={onFinish}
        layout="vertical"
        initialValues={{
          hasReturnJourney: false,
        }}
      >
        <Form.Item
          label="Start Location"
          name="startLocation"
          rules={[
            { required: true, message: "Please select start location" },
          ]}
        >
          <AutoComplete
            options={startOptions}
            style={{ width: "100%" }}
            onSelect={(value) => handleSelect(value, "startLocation")}
            onSearch={(text) => searchLocation(text)}
            placeholder="Enter starting location"
          />
        </Form.Item>

        <Form.Item
          label="End Location"
          name="endLocation"
          rules={[
            { required: true, message: "Please select end location" },
          ]}
        >
          <AutoComplete
            options={endOptions}
            style={{ width: "100%" }}
            onSelect={(value) => handleSelect(value, "endLocation")}
            onSearch={(text) => searchLocation(text)}
            placeholder="Enter destination"
          />
        </Form.Item>

        <h3>Select Date and Time</h3>

        <Form.Item
          label="Outbound Journey - Start Date & Time"
          name="oneWayStartTime"
          rules={[
            { required: true, message: "Please select start date and time" },
          ]}
        >
          <DatePicker
            showTime
            format="DD-MM-YYYY HH:mm"
            style={{ width: "100%" }}
            placeholder="Select start date and time"
            disabledDate={disabledDate}
          />
        </Form.Item>

        <Form.Item
          label="Outbound Journey - End Date & Time"
          name="oneWayEndTime"
          rules={[
            { required: true, message: "Please select end date and time" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                const startTime = getFieldValue("oneWayStartTime");
                if (!value || !startTime || value.isAfter(startTime)) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("End date must be after start date")
                );
              },
            }),
          ]}
        >
          <DatePicker
            showTime
            format="DD-MM-YYYY HH:mm"
            style={{ width: "100%" }}
            placeholder="Select end date and time"
            disabledDate={disabledDate}
          />
        </Form.Item>

        <Form.Item name="hasReturnJourney" valuePropName="checked">
          <Checkbox onChange={handleReturnJourneyChange}>
            Add Return Journey
          </Checkbox>
        </Form.Item>

        {hasReturnJourney && (
          <>
            <Form.Item
              label="Return Journey - Start Date & Time"
              name="returnStartTime"
              rules={[
                {
                  required: hasReturnJourney,
                  message: "Please select return start date and time",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    const oneWayEndTime = getFieldValue("oneWayEndTime");
                    if (
                      !value ||
                      !oneWayEndTime ||
                      value.isAfter(oneWayEndTime)
                    ) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error(
                        "Return start date must be after outbound end date"
                      )
                    );
                  },
                }),
              ]}
            >
              <DatePicker
                showTime
                format="DD-MM-YYYY HH:mm"
                style={{ width: "100%" }}
                placeholder="Select return start date and time"
                disabledDate={disabledDate}
              />
            </Form.Item>

            <Form.Item
              label="Return Journey - End Date & Time"
              name="returnEndTime"
              rules={[
                {
                  required: hasReturnJourney,
                  message: "Please select return end date and time",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    const returnStartTime = getFieldValue("returnStartTime");
                    if (
                      !value ||
                      !returnStartTime ||
                      value.isAfter(returnStartTime)
                    ) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error(
                        "Return end date must be after return start date"
                      )
                    );
                  },
                }),
              ]}
            >
              <DatePicker
                showTime
                format="DD-MM-YYYY HH:mm"
                style={{ width: "100%" }}
                placeholder="Select return end date and time"
                disabledDate={disabledDate}
              />
            </Form.Item>
          </>
        )}

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              Search Routes
            </Button>
            <Button
              onClick={() => {
                form.resetFields();
                setHasReturnJourney(false);
              }}
            >
              Reset
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
}

export default App;
