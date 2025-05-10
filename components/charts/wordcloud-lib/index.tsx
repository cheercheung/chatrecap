import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { scaleLinear } from 'd3-scale';
import d3Cloud from 'd3-cloud';

interface WordItem {
  word: string;
  count: number;
}

interface WordCloudLibProps {
  words: WordItem[];
  maxWords?: number;
  className?: string;
  width?: number;
  height?: number;
  fontFamily?: string;
  fontWeight?: string;
  padding?: number;
  rotate?: number | ((word: string) => number);
  fontSize?: number | ((word: WordItem) => number);
}

/**
 * 词云图组件 - 使用 d3-cloud 库
 */
const WordCloudLib: React.FC<WordCloudLibProps> = ({
  words,
  maxWords = 20,
  className = '',
  width = 500,
  height = 300,
  fontFamily = 'sans-serif',
  fontWeight = 'normal',
  padding = 5,
  rotate = 0,
  fontSize = 20,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [cloudWords, setCloudWords] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!words || words.length === 0) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // 准备数据 - 只取前 maxWords 个词
      const wordData = words
        .slice(0, maxWords)
        .map(d => ({
          text: d.word,
          size: typeof fontSize === 'function' ? fontSize(d) : fontSize,
          value: d.count
        }));

      // 准备词云布局

      // 创建词云布局
      const layout = d3Cloud()
        .size([width, height])
        .words(wordData)
        .padding(padding)
        .rotate(typeof rotate === 'function' ? (d: any) => (rotate as any)(d.text) : () => rotate)
        .font(fontFamily)
        .fontWeight(fontWeight)
        .fontSize((d: any) => d.size)
        .on("end", (words: any) => {
          setCloudWords(words);
          setIsLoading(false);
        });

      // 开始布局计算
      layout.start();
    } catch (err) {
      console.error('Error creating word cloud:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setIsLoading(false);
    }
  }, [words, maxWords, width, height, fontFamily, fontWeight, padding, rotate, fontSize]);

  // 渲染词云
  useEffect(() => {
    if (!svgRef.current || cloudWords.length === 0) return;

    try {
      // 清除之前的内容
      d3.select(svgRef.current).selectAll("*").remove();

      // 创建词云
      const svg = d3.select(svgRef.current)
        .attr("width", width)
        .attr("height", height);

      // 创建渐变色定义
      const defs = svg.append("defs");

      // 创建线性渐变
      const gradient = defs.append("linearGradient")
        .attr("id", "word-cloud-gradient")
        .attr("x1", "0%")
        .attr("y1", "0%")
        .attr("x2", "100%")
        .attr("y2", "100%");

      // 添加渐变色停止点
      gradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", "hsl(var(--primary))");

      gradient.append("stop")
        .attr("offset", "50%")
        .attr("stop-color", "hsl(var(--primary) / 0.8)");

      gradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", "hsl(var(--primary) / 0.6)");

      // 找出最大和最小值，用于颜色映射
      const values = cloudWords.map((d: any) => d.value);
      const minValue = Math.min(...values);
      const maxValue = Math.max(...values);

      // 创建颜色比例尺
      const colorScale = scaleLinear<string>()
        .domain([minValue, (minValue + maxValue) / 2, maxValue])
        .range(["hsl(var(--primary) / 0.6)", "hsl(var(--primary) / 0.8)", "hsl(var(--primary))"]);

      // 添加词云组
      svg.append("g")
        .attr("transform", `translate(${width / 2},${height / 2})`)
        .selectAll("text")
        .data(cloudWords)
        .enter()
        .append("text")
        .style("font-family", fontFamily)
        .style("font-weight", fontWeight)
        // 使用主题色渐变
        .style("fill", (d: any) => {
          // 根据词频映射到颜色比例尺
          return colorScale(d.value);
        })
        .attr("text-anchor", "middle")
        .attr("transform", (d: any) => `translate(${d.x},${d.y}) rotate(${d.rotate})`)
        .attr("font-size", (d: any) => `${d.size}px`)
        .text((d: any) => d.text)
        // 添加悬停效果
        .style("cursor", "pointer")
        .on("mouseover", function() {
          d3.select(this)
            .transition()
            .duration(200)
            .style("font-size", (d: any) => `${d.size * 1.2}px`)
            .style("font-weight", "bold")
            .style("fill", "url(#word-cloud-gradient)"); // 悬停时使用渐变色
        })
        .on("mouseout", function(_event, d: any) {
          d3.select(this)
            .transition()
            .duration(200)
            .style("font-size", (d: any) => `${d.size}px`)
            .style("font-weight", fontWeight)
            .style("fill", colorScale(d.value)); // 恢复原来的颜色
        });

      // 词云渲染完成
    } catch (err) {
      console.error('Error rendering word cloud:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  }, [cloudWords, width, height, fontFamily, fontWeight]);

  return (
    <div className={`wordcloud-container ${className}`} style={{ width, height, position: 'relative' }}>
      {isLoading ? (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          Loading word cloud...
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-full text-red-500">
          Error: {error}
        </div>
      ) : words.length === 0 ? (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          No words to display
        </div>
      ) : (
        <>
          <svg
            ref={svgRef}
            width={width}
            height={height}
            style={{ width: '100%', height: '100%' }}
          />

          {/* 不显示调试信息 */}
        </>
      )}
    </div>
  );
};

export default WordCloudLib;
