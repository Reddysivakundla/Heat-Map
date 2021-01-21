import { Component, VERSION } from '@angular/core';
import { Chart } from 'chart.js';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent  {
  name = 'Angular ' + VERSION.major;

  mychart = [];
  results;
  reqData = [];
  datesArr = []

  constructor(private http:HttpClient) {

  }
  generateData() {
			var data = [];
      data = this.reqData;
			return data;
		}
    options = {
			legend: false,
      layout: {
          padding: {
              // Any unspecified dimensions are assumed to be 0                     
              top: 50,
              bottom : 10,
          }
      },
      responsive: true,
			tooltips: {
            callbacks: {
                label : function(tooltipItem,chart){
                  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                  let toolArray = chart.datasets[0].data;
                  let dispalyValue;
                    toolArray.forEach(element => {
                      let d2 = tooltipItem.yLabel.substr(0,3);
                      let d3 = Number(tooltipItem.yLabel.substr(4,2));
                      let d1 = tooltipItem.yLabel.substr(8,4);

                      if((monthNames[element.y.getMonth()] == d2 && element.y.getDate() == d3 && element.y.getFullYear() == d1  ) && element.x == tooltipItem.xLabel){
                        dispalyValue = element.v;
                      }
                    });
                    if(dispalyValue == 0){
                      return "0";
                    }
                    return dispalyValue;
                }
            }
        },

			elements: {
				point: {
					backgroundColor: function(ctx) {
					var reqVal = ctx.dataset.data[ctx.dataIndex].v;
					var reqColour;
					if(reqVal <= 100){
						reqColour = '#c2d1f3';
					  }
					  else if(reqVal>100 && reqVal <= 200){
						reqColour = '#99b3eb';
					  }
					  else if(reqVal>200 && reqVal <= 300){
						reqColour = '#7095e2';
					  }
					  else if(reqVal>300 && reqVal <= 400){
						reqColour = '#527edc';
					  }
					  else if(reqVal>400 && reqVal <= 500){
						reqColour = '#3367d6';
					  }
					  else if(reqVal>500 && reqVal <= 600){
						reqColour = '#2e5fd1';
					  }
					  else if(reqVal>600 && reqVal <= 700){
						reqColour = '#2754cc';
					  }
					  else if(reqVal>700 && reqVal <= 800){
						reqColour = '#204ac6';
					  }
					  else{
						reqColour = '#1439bc';
					  }
					return reqColour;
				},
          pointStyle : 'rect',
          radius : function(ctx){
            var heig = ctx.chart.height;
            var widh = ctx.chart.width;
            var ares = heig * widh;
            return ares/9000;
          },
				},
			},
      scales: {
        yAxes: [{
          offset : true,
          type: 'time',
          distribution: 'linear',
          time: {
                unit: 'week',
          },
          scaleLabel: {
              display: true,
              labelString: 'Days'
            },
            gridLines: {
              display: false,
              drawBorder: false
           },
           ticks : {
             source : "data",
             autoSkip : true
           }
        }],
        xAxes: [{
          offset : true,
          scaleLabel: {
              display: true,
              labelString: 'Hours'
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
            ticks: {
              padding:40,
              min: 0,
              max: 7,
              stepSize: 1,
              fixedStepSize: 1,
              callback: function(value, index, values) {
                return value*3+"-"+(value+1)*3;
              }
            },
        }],
      }
		};

  getData(data){
    this.results = data;
    let som:any[] = this.results.data.changessetDetailsHeatmap;
    for(let x=0;x<som.length;x++){
      let dateStr:string[] = som[x].date.split("T");
      if(!this.datesArr.find( y=> (y == dateStr[0]))){
        this.datesArr.push(dateStr[0]);
      }
    }
    let cnt=0;
    for(let pq=0;pq<=7;pq++){
      for(let pr=0;pr<this.datesArr.length;pr++){
        var finalVal:number = 0;
        som.forEach(element =>{
          let reqDat = element.date.split("T")[0];
          let reVal: number = Number(element.date.split("T")[1]);  
          if(this.datesArr[pr] == reqDat && (reVal >= pq*3 && reVal<pq*3+3)){
            finalVal+=element.count;
          }
        });
        this.reqData[cnt] = {};
        this.reqData[cnt].x = pq;
        this.reqData[cnt].y = new Date(this.datesArr[pr]);
        this.reqData[cnt].v =  finalVal;
        cnt++;
        
      }
    }
    this.drawChart();
  }

  drawChart(){
    var data = {
			datasets: [{
				data: this.generateData()
			},]
		};

    let ctx1 = <HTMLCanvasElement> document.getElementById("mychart");
    let ctx = ctx1.getContext("2d");

    this.mychart = new Chart(ctx, {
			type: 'bubble',
			data: data,
			options: this.options
	  });
  }

  ngOnInit(){
    this.http.get("assets/sample.json",{responseType: 'json'}).subscribe(
      data => { this.getData(data) }
    );

  }
}
