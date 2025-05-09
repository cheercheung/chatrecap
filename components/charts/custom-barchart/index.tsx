"use client";

import React from 'react';
// Import CSS module from local directory
import styles from './bar-chart.module.css';

interface EmojiItem {
  emoji: string;
  count: number;
}

interface CustomBarChartProps {
  data: EmojiItem[] | { label: string; value: number }[];
  title?: string;
  maxItems?: number;
  className?: string;
  showCount?: boolean;
  barColor?: string;
  isEmoji?: boolean;
  senderType?: 'sender1' | 'sender2'; // Added sender type for custom colors
}

/**
 * Custom bar chart component with consistent styling and sender-specific colors
 */
const CustomBarChart: React.FC<CustomBarChartProps> = ({
  data,
  title,
  maxItems = 10,
  className,
  showCount = true,
  barColor,
  isEmoji = false,
  senderType,
}) => {
  // Process data to support both emoji and text formats with completely consistent handling
  const processedData = isEmoji
    ? (data as EmojiItem[]).map(item => ({
        label: item.emoji,
        value: item.count
      }))
    : (data as { label: string; value: number }[]).map(item => ({
        // Truncate long words to ensure consistent display
        label: item.label.length > 10 ? item.label.substring(0, 8) + '...' : item.label,
        value: item.value
      }));

  // Limit the number of items to display
  const displayItems = processedData.slice(0, maxItems);

  // If no data, show empty state message
  if (displayItems.length === 0) {
    return <div className={styles.emptyState}>No data found</div>;
  }

  // Get the maximum value for calculating percentage width
  const maxValue = Math.max(...displayItems.map(item => item.value));

  // Determine the bar color based on sender type
  const getBarColor = () => {
    // If a specific color is provided, use it
    if (barColor) return barColor;

    // Use sender-specific colors
    if (senderType === 'sender1') {
      return '#ff6b9c'; // Pink color for sender1 (Emily)
    } else if (senderType === 'sender2') {
      return '#4dabf7'; // Blue color for sender2 (John)
    }

    // Default color if no sender type specified
    return 'hsl(var(--primary))';
  };

  return (
    <div className={`${styles.barChartContainer} ${className || ''}`}>
      {title && <h4 className="text-xl font-medium mb-6 text-center">{title}</h4>}
      <div>
        {displayItems.map((item, index) => (
          <div key={index} className={styles.barItem}>
            {/* Apply consistent label styling with specific class based on content type */}
            <div className={isEmoji ? styles.labelEmoji : styles.labelText}>
              {item.label}
            </div>
            {/* Consistent bar track styling */}
            <div className={styles.barTrack}>
              <div
                className={styles.barFill}
                style={{
                  width: `${(item.value / maxValue) * 100}%`,
                  backgroundColor: getBarColor()
                }}
              ></div>
            </div>
            {/* Consistent count value styling */}
            {showCount && (
              <div className={styles.countValue}>
                {item.value}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomBarChart;
