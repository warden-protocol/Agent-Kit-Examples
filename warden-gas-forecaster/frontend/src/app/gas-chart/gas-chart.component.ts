import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Chart} from 'chart.js/auto';

@Component({
  selector: 'app-gas-chart',
  templateUrl: './gas-chart.component.html',
  styleUrls: ['./gas-chart.component.css']
})
export class GasChartComponent implements OnInit {
  @ViewChild('gasChart') gasChart!: ElementRef;
  chart!: Chart;
  labels: string[] = [];
  realPrices: number[] = [];
  predictedPrices: number[] = [];

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    document.title = "AI Gas Forecaster";

    setTimeout(() => this.initializeChart(), 0);
    this.fetchGasPrices();
    setInterval(() => this.fetchGasPrices(), 5000);
  }

  initializeChart() {
    const ctx = this.gasChart.nativeElement.getContext('2d');
    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.labels,
        datasets: [
          {
            label: 'Real Price',
            data: this.realPrices,
            borderColor: 'green',
            borderWidth: 2,
            pointRadius: 3,
            pointHoverRadius: 6,
            fill: false,
            tension: 0.4
          },
          {
            label: 'Predicted Price',
            data: this.predictedPrices,
            borderColor: 'blue',
            borderWidth: 1,
            pointRadius: 2,
            pointHoverRadius: 5,
            fill: false,
            tension: 0.4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            enabled: true,
            mode: 'nearest',
            intersect: false
          }
        },
        scales: {
          x: {display: false},
          y: {display: false}
        }
      }
    });
  }

  fetchGasPrices() {
    this.http.get<any>('http://localhost:3000/gas-prices').subscribe(data => {
      if (!data?.real || !data?.predicted || !this.chart) return;

      const latestReal = data.real[data.real.length - 1];
      const latestPredicted = data.predicted[data.predicted.length - 1];

      const timestamp = new Date(latestReal.timestamp).toLocaleTimeString();

      if (this.labels.includes(timestamp)) return;

      this.labels.push(timestamp);
      this.realPrices.push(latestReal.price);
      this.predictedPrices.push(latestPredicted.price || 0);

      const maxPoints = 30;
      if (this.labels.length > maxPoints) {
        this.labels.shift();
        this.realPrices.shift();
        this.predictedPrices.shift();
      }

      this.chart.data.labels = [...this.labels];
      this.chart.data.datasets[0].data = [...this.realPrices];
      this.chart.data.datasets[1].data = [...this.predictedPrices];

      this.chart.update();

      (document.getElementById("realPrice") as HTMLElement).innerText = latestReal.price.toFixed(2);
      (document.getElementById("predictedPrice") as HTMLElement).innerText = latestPredicted.price.toFixed(2);
    });
  }

}
