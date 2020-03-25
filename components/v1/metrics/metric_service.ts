import IMetric from "./IMetric";

const MS_PER_HOUR = 36e5;

interface MetricProp {
  [timestamp: string]: number;
}

interface Metric {
  [name: string]: Array<MetricProp>;
}

// let metrics: Metric = {}; // holds all of the metrics logged. Cleared once the server is restarted.

export class MetricService {
  private metrics: Metric = {}; // holds all of the metrics logged. Cleared once the server is restarted.
  constructor() {}

  /**
   * Adds a metric to the global `metrics` object
   * @param object
   */
  logMetric(object: IMetric) {
    let timestamp = new Date().getTime();
    let metric: MetricProp = {};
    metric[timestamp] = Math.round(Number(object.value));
    if (!this.metrics.hasOwnProperty(object.key))
      this.metrics[object.key] = [metric];
    // if the key doesn't at all exist add it to the metrics map
    else this.metrics[object.key].push(metric); // update the metric key with the new metric value
    return true;
  }

  /**
   * Sums all the data for a given metric
   * @param key: string
   */
  public sumMetricByKey(key: string): boolean | number {
    if (!this.metricKeyExists(key)) return false;
    let sum = this.sum(this.metrics[key]);
    this.updateMetricData(key, this.metrics[key]);

    return sum;
  }

  private metricKeyExists(key: string): boolean {
    return this.metrics.hasOwnProperty(key);
  }

  private sum(metricValues: Array<MetricProp>): number {
    let sum = 0;
    let today = new Date();
    for (const metricValue of metricValues) {
      let timestamp = Object.keys(metricValue)[0];
      if (this.dateDifferenceInHours(today, new Date(Number(timestamp))) <= 1) {
        sum += metricValue[timestamp];
      }
    }
    return sum;
  }

  /**
   * removes metric data older than 1 hour
   * @param key
   * @param lines
   */
  private updateMetricData(key: string, metricValues: Array<MetricProp>): void {
    let today = new Date();
    let metricValuesClone = JSON.parse(JSON.stringify(metricValues));

    let result = metricValuesClone.filter((metricValue: MetricProp) => {
      let timestamp = Object.keys(metricValue)[0];
      return this.dateDifferenceInHours(today, new Date(Number(timestamp))) < 1;
    });

    this.metrics[key] = result;
  }

  /**
   * returns the difference in hours between two dates
   * @param a: Date
   * @param b: Date
   */
  private dateDifferenceInHours(a: Date, b: Date) {
    return Math.floor(Math.abs((a.getTime() - b.getTime()) / MS_PER_HOUR));
  }
}
