import { v4 } from "uuid";
import {
  AreaChart,
  BarChart,
  DonutChart,
  Legend,
  LineChart,
} from "@tremor/react";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Funnel,
  FunnelChart,
  Line,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  RadialBar,
  RadialBarChart,
  Scatter,
  ScatterChart,
  Treemap,
  XAxis,
  YAxis,
} from "recharts";
import { Colors, getTremorColor } from "./chart-utils.js";
import CustomCell from "./CustomCell.jsx";
import Tooltip from "./CustomTooltip.jsx";
import { safeJsonParse } from "@/utils/request.js";
import renderMarkdown from "@/utils/chat/markdown.js";
import { WorkspaceProfileImage } from "../PromptReply/index.jsx";
import { memo, useCallback, useState } from "react";
import { saveAs } from "file-saver";
import { useGenerateImage } from "recharts-to-png";
import { CircleNotch, DownloadSimple } from "@phosphor-icons/react";

/**
 * 数字格式化函数
 * @param {number} number - 需要格式化的数字
 * @returns {string} - 格式化后的字符串
 */
const dataFormatter = (number) => {
  return Intl.NumberFormat("us").format(number).toString();
};

export function Chartable({ props, workspace }) {
  const [getDivJpeg, { ref }] = useGenerateImage({
    quality: 1,
    type: "image/jpeg",
    options: {
      backgroundColor: "#393d43",
      padding: 20,
    },
  });
  
  // 处理图表下载
  const handleDownload = useCallback(async () => {
    const jpeg = await getDivJpeg();
    if (jpeg) saveAs(jpeg, `图表-${v4().split("-")[0]}.jpg`);
  }, []);

  const color = null;
  const showLegend = true;
  const content =
    typeof props.content === "string"
      ? safeJsonParse(props.content, null)
      : props.content;
  if (content === null) return null;

  const chartType = content?.type?.toLowerCase();
  const data =
    typeof content.dataset === "string"
      ? safeJsonParse(content.dataset, [])
      : content.dataset;
  const value = data.length > 0 ? Object.keys(data[0])[1] : "value";
  const title = content?.title;

  // 根据图表类型渲染不同的图表
  const renderChart = () => {
    switch (chartType) {
      case "area":
        return (
          <div className="bg-theme-bg-primary p-8 rounded-xl text-white light:border light:border-theme-border-primary shadow-md hover:shadow-lg transition-shadow duration-300">
            <h3 className="text-lg text-theme-text-primary font-medium mb-4">
              {title}
            </h3>
            <AreaChart
              className="h-[350px]"
              data={data}
              index="name"
              categories={[value]}
              colors={[color || "blue", "cyan"]}
              showLegend={showLegend}
              valueFormatter={dataFormatter}
            />
          </div>
        );
      case "bar":
        return (
          <div className="bg-theme-bg-primary p-8 rounded-xl text-white light:border light:border-theme-border-primary shadow-md hover:shadow-lg transition-shadow duration-300">
            <h3 className="text-lg text-theme-text-primary font-medium mb-4">
              {title}
            </h3>
            <BarChart
              className="h-[350px]"
              data={data}
              index="name"
              categories={[value]}
              colors={[color || "blue"]}
              showLegend={showLegend}
              valueFormatter={dataFormatter}
              layout={"vertical"}
              yAxisWidth={100}
            />
          </div>
        );
      case "line":
        return (
          <div className="bg-theme-bg-primary p-8 pb-12 rounded-xl text-white h-[500px] w-full light:border light:border-theme-border-primary shadow-md hover:shadow-lg transition-shadow duration-300">
            <h3 className="text-lg text-theme-text-primary font-medium mb-4">
              {title}
            </h3>
            <LineChart
              className="h-[400px]"
              data={data}
              index="name"
              categories={[value]}
              colors={[color || "blue"]}
              showLegend={showLegend}
              valueFormatter={dataFormatter}
            />
          </div>
        );
      case "composed":
        return (
          <div className="bg-theme-bg-primary p-8 rounded-xl text-white light:border light:border-theme-border-primary shadow-md hover:shadow-lg transition-shadow duration-300">
            <h3 className="text-lg text-theme-text-primary font-medium mb-4">
              {title}
            </h3>
            {showLegend && (
              <Legend
                categories={[value]}
                colors={[color || "blue", color || "blue"]}
                className="mb-5 justify-end"
              />
            )}
            <ComposedChart width={500} height={260} data={data}>
              <CartesianGrid
                strokeDasharray="3 3"
                horizontal
                vertical={false}
              />
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
                tick={{ transform: "translate(0, 6)", fill: "white" }}
                style={{
                  fontSize: "12px",
                  fontFamily: "Inter; Helvetica",
                }}
                padding={{ left: 10, right: 10 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                type="number"
                tick={{ transform: "translate(-3, 0)", fill: "white" }}
                style={{
                  fontSize: "12px",
                  fontFamily: "Inter; Helvetica",
                }}
              />
              <Tooltip legendColor={getTremorColor(color || "blue")} />
              <Line
                type="linear"
                dataKey={value}
                stroke={getTremorColor(color || "blue")}
                dot={false}
                strokeWidth={2}
              />
              <Bar
                dataKey="value"
                name="value"
                type="linear"
                fill={getTremorColor(color || "blue")}
              />
            </ComposedChart>
          </div>
        );
      case "scatter":
        return (
          <div className="bg-theme-bg-primary p-8 rounded-xl text-white light:border light:border-theme-border-primary shadow-md hover:shadow-lg transition-shadow duration-300">
            <h3 className="text-lg text-theme-text-primary font-medium mb-4">
              {title}
            </h3>
            {showLegend && (
              <div className="flex justify-end">
                <Legend
                  categories={[value]}
                  colors={[color || "blue", color || "blue"]}
                  className="mb-5"
                />
              </div>
            )}
            <ScatterChart width={500} height={260} data={data}>
              <CartesianGrid
                strokeDasharray="3 3"
                horizontal
                vertical={false}
              />
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
                tick={{ transform: "translate(0, 6)", fill: "white" }}
                style={{
                  fontSize: "12px",
                  fontFamily: "Inter; Helvetica",
                }}
                padding={{ left: 10, right: 10 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                type="number"
                tick={{ transform: "translate(-3, 0)", fill: "white" }}
                style={{
                  fontSize: "12px",
                  fontFamily: "Inter; Helvetica",
                }}
              />
              <Tooltip legendColor={getTremorColor(color || "blue")} />
              <Scatter dataKey={value} fill={getTremorColor(color || "blue")} />
            </ScatterChart>
          </div>
        );
      case "pie":
        return (
          <div className="bg-theme-bg-primary p-8 rounded-xl text-white light:border light:border-theme-border-primary shadow-md hover:shadow-lg transition-shadow duration-300">
            <h3 className="text-lg text-theme-text-primary font-medium mb-4">
              {title}
            </h3>
            <DonutChart
              data={data}
              category={value}
              index="name"
              colors={[
                color || "cyan",
                "violet",
                "rose",
                "amber",
                "emerald",
                "teal",
                "fuchsia",
              ]}
              // 饼图没有实际的图例，但这会切换中央文本
              showLabel={showLegend}
              valueFormatter={dataFormatter}
              customTooltip={customTooltip}
            />
          </div>
        );
      case "radar":
        return (
          <div className="bg-theme-bg-primary p-8 rounded-xl text-white light:border light:border-theme-border-primary shadow-md hover:shadow-lg transition-shadow duration-300">
            <h3 className="text-lg text-theme-text-primary font-medium mb-4">
              {title}
            </h3>
            {showLegend && (
              <div className="flex justify-end">
                <Legend
                  categories={[value]}
                  colors={[color || "blue", color || "blue"]}
                  className="mb-5"
                />
              </div>
            )}
            <RadarChart
              cx={300}
              cy={250}
              outerRadius={150}
              width={600}
              height={500}
              data={data}
            >
              <PolarGrid />
              <PolarAngleAxis dataKey="name" tick={{ fill: "white" }} />
              <PolarRadiusAxis tick={{ fill: "white" }} />
              <Tooltip legendColor={getTremorColor(color || "blue")} />
              <Radar
                dataKey="value"
                stroke={getTremorColor(color || "blue")}
                fill={getTremorColor(color || "blue")}
                fillOpacity={0.6}
              />
            </RadarChart>
          </div>
        );
      case "radialbar":
        return (
          <div className="bg-theme-bg-primary p-8 rounded-xl text-white light:border light:border-theme-border-primary shadow-md hover:shadow-lg transition-shadow duration-300">
            <h3 className="text-lg text-theme-text-primary font-medium mb-4">
              {title}
            </h3>
            {showLegend && (
              <div className="flex justify-end">
                <Legend
                  categories={[value]}
                  colors={[color || "blue", color || "blue"]}
                  className="mb-5"
                />
              </div>
            )}
            <RadialBarChart
              width={500}
              height={300}
              cx={150}
              cy={150}
              innerRadius={20}
              outerRadius={140}
              barSize={10}
              data={data}
            >
              <RadialBar
                angleAxisId={15}
                label={{
                  position: "insideStart",
                  fill: getTremorColor(color || "blue"),
                }}
                dataKey="value"
              />
              <Tooltip legendColor={getTremorColor(color || "blue")} />
            </RadialBarChart>
          </div>
        );
      case "treemap":
        return (
          <div className="bg-theme-bg-primary p-8 rounded-xl text-white light:border light:border-theme-border-primary shadow-md hover:shadow-lg transition-shadow duration-300">
            <h3 className="text-lg text-theme-text-primary font-medium mb-4">
              {title}
            </h3>
            {showLegend && (
              <div className="flex justify-end">
                <Legend
                  categories={[value]}
                  colors={[color || "blue", color || "blue"]}
                  className="mb-5"
                />
              </div>
            )}
            <Treemap
              width={500}
              height={260}
              data={data}
              dataKey="value"
              stroke="#fff"
              fill={getTremorColor(color || "blue")}
              content={<CustomCell colors={Object.values(Colors)} />}
            >
              <Tooltip legendColor={getTremorColor(color || "blue")} />
            </Treemap>
          </div>
        );
      case "funnel":
        return (
          <div className="bg-theme-bg-primary p-8 rounded-xl text-white light:border light:border-theme-border-primary shadow-md hover:shadow-lg transition-shadow duration-300">
            <h3 className="text-lg text-theme-text-primary font-medium mb-4">
              {title}
            </h3>
            {showLegend && (
              <div className="flex justify-end">
                <Legend
                  categories={[value]}
                  colors={[color || "blue", color || "blue"]}
                  className="mb-5"
                />
              </div>
            )}
            <FunnelChart width={500} height={300} data={data}>
              <Tooltip legendColor={getTremorColor(color || "blue")} />
              <Funnel dataKey="value" color={getTremorColor(color || "blue")} />
            </FunnelChart>
          </div>
        );
      default:
        return <p>不支持的图表类型。</p>;
    }
  };

  if (!!props.chatId) {
    return (
      <div className="flex justify-center items-end w-full">
        <div className="py-2 px-4 w-full flex gap-x-5 md:max-w-[80%] flex-col">
          <div className="flex gap-x-5">
            <WorkspaceProfileImage workspace={workspace} />
            <div className="relative w-full">
              <DownloadGraph onClick={handleDownload} />
              <div ref={ref}>{renderChart()}</div>
              <span
                className={`flex flex-col gap-y-1 mt-2`}
                dangerouslySetInnerHTML={{
                  __html: renderMarkdown(content.caption),
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-end w-full">
      <div className="py-2 px-4 w-full flex gap-x-5 md:max-w-[80%] flex-col">
        <div className="relative w-full">
          <DownloadGraph onClick={handleDownload} />
          <div ref={ref}>{renderChart()}</div>
        </div>
        <div className="flex gap-x-5">
          <span
            className={`flex flex-col gap-y-1 mt-2`}
            dangerouslySetInnerHTML={{
              __html: renderMarkdown(content.caption),
            }}
          />
        </div>
      </div>
    </div>
  );
}

/**
 * 自定义提示组件，显示图表的详细信息
 */
const customTooltip = (props) => {
  const { payload, active } = props;
  if (!active || !payload) return null;
  const categoryPayload = payload?.[0];
  if (!categoryPayload) return null;
  return (
    <div className="w-56 bg-theme-bg-primary rounded-lg border p-2 text-white shadow-lg">
      <div className="flex flex-1 space-x-2.5">
        <div
          className={`flex w-1.5 flex-col bg-${categoryPayload?.color}-500 rounded`}
        />
        <div className="w-full">
          <div className="flex items-center justify-between space-x-8">
            <p className="whitespace-nowrap text-right text-tremor-content">
              {categoryPayload.name}
            </p>
            <p className="whitespace-nowrap text-right font-medium text-tremor-content-emphasis">
              {categoryPayload.value}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * 图表下载按钮组件
 * @param {Object} props - 组件属性
 * @param {Function} props.onClick - 点击事件处理函数
 */
function DownloadGraph({ onClick }) {
  const [loading, setLoading] = useState(false);
  const handleClick = async () => {
    setLoading(true);
    await onClick?.();
    setLoading(false);
  };

  return (
    <div className="absolute top-3 right-3 z-50 cursor-pointer">
      <div className="flex flex-col items-center">
        <div className="p-1.5 rounded-full border-none bg-theme-bg-secondary hover:bg-theme-bg-hover transition-colors duration-200">
          {loading ? (
            <CircleNotch
              className="text-theme-text-primary w-5 h-5 animate-spin"
              aria-label="正在下载图片..."
            />
          ) : (
            <DownloadSimple
              weight="bold"
              className="text-theme-text-primary w-5 h-5 hover:text-theme-text-primary"
              onClick={handleClick}
              aria-label="下载图表图片"
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default memo(Chartable);
