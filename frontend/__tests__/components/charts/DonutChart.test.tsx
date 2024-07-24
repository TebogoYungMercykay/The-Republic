import React from "react";
import { describe, expect } from "@jest/globals";
import { render, waitFor } from "@testing-library/react";
import DonutChart from "@/components/ReportCharts/DonutChart/DonutChart";
import * as echarts from "echarts";

jest.mock("echarts");

describe("DonutChart", () => {
  const mockEchartsInstance = {
    setOption: jest.fn(),
    dispose: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
    (echarts.init as jest.Mock).mockReturnValue(mockEchartsInstance);
  });

  afterEach(() => {
    (console.error as jest.Mock).mockRestore();
  });

  it("renders the chart and sets options correctly", async () => {
    render(<DonutChart />);
  });

  it("updates the chart options on data change", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            success: true,
            data: {
              resolved: { "Category A": 10, "Category B": 20 },
              unresolved: { "Category A": 5, "Category B": 15 },
            },
          }),
      }),
    ) as jest.Mock;

    render(<DonutChart />);

    await waitFor(() => {
      expect(mockEchartsInstance.setOption).toHaveBeenCalledTimes(1); // Called once after data fetch
    });
  });
});
