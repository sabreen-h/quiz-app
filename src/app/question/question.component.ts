import { Component, OnInit } from '@angular/core';
import { interval } from 'rxjs';
import { QuestionService } from '../service/question.service';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent implements OnInit {

  public name: string="";
  public questionList: any =[];
  public currentQuestion:number=0;
  public points: number=0;
  progress:string="0";
  counter=60;
  correctAnswer:number=0;
  incorrectAnswer:number=0;
  interval$:any;
  isCompleted:boolean = false;

  constructor(private questionService:QuestionService) { }

  ngOnInit(): void {
    this.name=localStorage.getItem("name")!;
    this.getAllQuestions();
    this.stratCounter();
  }

  getAllQuestions(){
    this.questionService.getQuestionJson().subscribe(res=>
      {
      this.questionList= res.questions;
     })

  }

  nextQuestion(){
    this.currentQuestion++;
}

previousQuestion(){
  this.currentQuestion--;
}

answer(currentQu:number , option:any){
  if(currentQu=== this.questionList.length){
    this.isCompleted=true;
    this.stopCounter();
  }
  if(option.correct){
    this.points+=10;
  
    this.correctAnswer++;
    setTimeout(()=>{
      this.currentQuestion++;
      this.resetCounter();
      this.getProgress();

  },1000);
   
    

  }else{
    this.points-=10;
    setTimeout(()=>{
      this.incorrectAnswer++;
    this.currentQuestion++;
    this.resetCounter();
    this.getProgress();

  },1000);

    

  }

}

stratCounter(){
  this.interval$=interval(1000)
  .subscribe(val=>{
    this.counter--;
    if(this.counter==0){
      this.currentQuestion++;
      this.counter=60;
      this.points-+10;
    }
  });
  setTimeout(()=>{
      this.interval$.unsubscribe();
  },600000)
}

stopCounter(){
  this.interval$.unsubscribe();
  this.counter=0;

}

resetCounter(){
  this.stopCounter();
  this.counter=60;
  this.stratCounter();

}

resetQuiz(){
  this.resetCounter();
  this.getAllQuestions();
  this.points=0;
  this.counter=60;
  this.currentQuestion=0;
  this.progress="0";

}

getProgress(){
  this.progress= ((this.currentQuestion/this.questionList.length)*100).toString();
  return this.progress;
}


}
