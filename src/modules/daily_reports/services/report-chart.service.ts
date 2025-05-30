import { Injectable } from '@nestjs/common';
import { ChartJSNodeCanvas } from 'chartjs-node-canvas';
import {
  ChartConfiguration,
  ChartTypeRegistry,
  PluginOptionsByType
} from 'chart.js';

// Tipos de gráficos soportados
export type ChartType = keyof ChartTypeRegistry;

// Opciones avanzadas para configuración de gráficos
export interface ChartOptions {
  width?: number;
  height?: number;
  backgroundColor?: string;
  fontFamily?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  legendPosition?: 'top' | 'left' | 'bottom' | 'right' | 'chartArea';
  devicePixelRatio?: number;
  imageFormat?: 'png' | 'jpeg';
  imageQuality?: number;
  lineWidth?: number;
  pointRadius?: number;
}

// 🔵 Plugin extendido para incluir 'datalabels'
interface ExtendedPlugins extends PluginOptionsByType<'bar'> {
  datalabels?: any;
}

@Injectable()
export class ReportChartService {
  private readonly chartJSNodeCanvas: ChartJSNodeCanvas;
  private readonly defaultColors: string[] = [
    '#4CAF50', '#2196F3', '#F44336', '#FFC107', '#9C27B0',
    '#FF5722', '#607D8B', '#795548', '#00BCD4', '#E91E63',
  ];

  constructor() {
    this.chartJSNodeCanvas = new ChartJSNodeCanvas({
      width: 1000,
      height: 600,
      backgroundColour: 'white',
      plugins: { requireLegacy: ['chartjs-plugin-datalabels'] }
    });
  }

  async generateChartImage(
    datasets: { label: string; data: number[]; backgroundColor?: string | string[] }[],
    labels: string[],
    title: string,
    type: ChartType = 'bar',
    options: ChartOptions = {}
  ): Promise<Buffer> {
    const width = options.width || 1000;
    const height = options.height || 600;
    const devicePixelRatio = options.devicePixelRatio || 2;
    const imageFormat = options.imageFormat === 'jpeg' ? 'image/jpeg' : 'image/png';
    const fontFamily = options.fontFamily || 'Arial, Helvetica, sans-serif';

    const enhancedDatasets = datasets.map((ds, i) => ({
      ...ds,
      backgroundColor: ds.backgroundColor || this.getDefaultColors(i, type),
      borderColor: type === 'line' ? this.getDefaultColors(i, type) : undefined,
      borderWidth: type === 'line' ? (options.lineWidth || 2) : 1,
      pointBackgroundColor: type === 'line' ? this.getDefaultColors(i, type) : undefined,
      pointRadius: type === 'line' ? (options.pointRadius || 4) : undefined,
      pointHoverRadius: type === 'line' ? (options.pointRadius || 4) + 2 : undefined,
      fill: type === 'line' ? false : undefined,
      tension: type === 'line' ? 0.4 : undefined,
    }));

    const config: ChartConfiguration = {
      type: type,
      data: { labels, datasets: enhancedDatasets },
      options: {
        responsive: false,
        maintainAspectRatio: false,
        plugins: this.getPlugins(type, title, fontFamily) as unknown as ExtendedPlugins,
        scales: this.getScales(type, options, fontFamily),
      }
    };

    return await this.chartJSNodeCanvas.renderToBuffer(config, imageFormat);
  }

  async generateDistributionChart(
    data: Record<string, number>,
    title: string,
    type: 'pie' | 'doughnut' = 'pie',
    options: ChartOptions = {}
  ): Promise<Buffer> {
    const labels = Object.keys(data);
    const values = Object.values(data);
    return this.generateChartImage([{ label: title, data: values }], labels, title, type, options);
  }

  async generateTimeSeriesChart(
    datasets: { label: string; data: { date: Date | string; value: number }[]; color?: string }[],
    title: string,
    options: ChartOptions = {}
  ): Promise<Buffer> {
    const allDates = new Set<string>();
    datasets.forEach(ds =>
      ds.data.forEach(item => {
        const dateStr = typeof item.date === 'string'
          ? item.date
          : `${item.date.getDate()}/${item.date.getMonth() + 1}`;
        allDates.add(dateStr);
      })
    );
    const labels = Array.from(allDates).sort();

    const formattedDatasets = datasets.map((ds, i) => ({
      label: ds.label,
      data: labels.map(label => {
        const found = ds.data.find(item => {
          const dateStr = typeof item.date === 'string'
            ? item.date
            : `${item.date.getDate()}/${item.date.getMonth() + 1}`;
          return dateStr === label;
        });
        return found ? found.value : 0;
      }),
      backgroundColor: ds.color || this.defaultColors[i % this.defaultColors.length]
    }));

    return this.generateChartImage(formattedDatasets, labels, title, 'line', options);
  }

  private getDefaultColors(index: number, type: ChartType): string | string[] {
    const color = this.defaultColors[index % this.defaultColors.length];
    if (['pie', 'doughnut', 'polarArea'].includes(type)) {
      return this.defaultColors;
    }
    return type === 'line' ? color : this.hexToRgba(color, 0.7);
  }

  private hexToRgba(hex: string, opacity: number): string {
    const r = parseInt(hex.substring(1, 3), 16);
    const g = parseInt(hex.substring(3, 5), 16);
    const b = parseInt(hex.substring(5, 7), 16);
    return `rgba(${r},${g},${b},${opacity})`;
  }

  private getScales(type: ChartType, options: ChartOptions = {}, fontFamily: string) {
    if (['pie', 'doughnut', 'polarArea'].includes(type)) return undefined;
    return {
      x: {
        title: options.xAxisLabel ? {
          display: true,
          text: options.xAxisLabel,
          font: { size: 16, family: fontFamily }
        } : undefined,
        ticks: { font: { size: 12, family: fontFamily } },
        grid: { color: 'rgba(0,0,0,0.1)' }
      },
      y: {
        title: options.yAxisLabel ? {
          display: true,
          text: options.yAxisLabel,
          font: { size: 16, family: fontFamily }
        } : undefined,
        beginAtZero: true,
        ticks: { font: { size: 12, family: fontFamily } },
        grid: { color: 'rgba(0,0,0,0.1)' }
      }
    };
  }

  private getPlugins(type: ChartType, title: string, fontFamily: string) {
    return {
      title: {
        display: !!title,
        text: title,
        font: { size: 24, family: fontFamily }
      },
      legend: {
        position: 'top',
        labels: { font: { size: 14, family: fontFamily } }
      },
      tooltip: { enabled: true },
      ...(type === 'pie' || type === 'doughnut' ? {
        datalabels: {
          formatter: (value: number, ctx: any) => {
            const dataset = ctx.chart.data.datasets[0];
            const total = dataset.data.reduce((sum: number, v: number) => sum + v, 0);
            return ((value / total) * 100).toFixed(1) + '%';
          },
          color: '#fff',
          font: { weight: 'bold', size: 14, family: fontFamily }
        }
      } : {})
    };
  }
}
