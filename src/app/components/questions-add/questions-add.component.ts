import { Router } from '@angular/router';
import { ApiService } from './../../service/api.service';
import { Component, OnInit, NgZone } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Question } from 'src/app/model/Questions';
import { ResourceLoader } from '@angular/compiler';


@Component({
  selector: 'app-questions-add',
  templateUrl: './questions-add.component.html',
  styleUrls: ['./questions-add.component.css']
})
export class QuestionsAddComponent implements OnInit {
  submitted = false;
  questionForm: FormGroup;
  userName: String = "admin";
  Skill:any = []; 
  QuestionTypes:any = ['SingleSelect','MultiSelect'];
  answerArray:Array<String>=[];
  optionsArray:Array<Object>=[];
  questionID:any;
  constructor(public fb: FormBuilder,
                  private router: Router,
                  private ngZone: NgZone,
                  private apiService: ApiService) { this.readSkill();this.mainForm();}

  ngOnInit() {this.apiService.getQuestionID().subscribe(
    (res) => {
      console.log('Question successfully createdgggg!',res.questionID);                  
      this.questionID=res.questionID;
      
    }, (error) => {
      console.log(error);
    });       }

  mainForm() {
      this.questionForm = this.fb.group({
        skill: ['', [Validators.required]],
        questionType: ['', [Validators.required]],
        question: ['', [Validators.required]],
        option1: ['', [Validators.required]],
        option2: ['', [Validators.required]],
        option3: ['', [Validators.required]],
        option4: ['', [Validators.required]],
        option1checkbox:[],
        option2checkbox:[],
        option3checkbox:[],
        option4checkbox:[],
        answerID:[],
        questionID:[],
       
      })
    }

    // Getter to access form control
      get myForm(){
        return this.questionForm.controls;
      }
  // Choose JRSS with select dropdown
    updateJRSS(e){
      this.questionForm.get('JRSS').setValue(e, {
      onlySelf: true
      })
    }
// Choose band with select dropdown
updateSkillProfile(e){
  this.questionForm.get('skill').setValue(e, {
  onlySelf: true
  })
}

// Get all Bands
readSkill(){
   this.apiService.getSkill().subscribe((data) => {
   this.Skill = data;
   })
}
    // Choose QuestionType with select dropdown
    updateQuestionTypes(e){
      this.questionForm.get('questionType').setValue(e, {
      onlySelf: true
      })
    }

    onSubmit() {
        this.submitted = true;
        if (!this.questionForm.valid) {
          console.log('error part');
          return false;
        } else {            
          this.answerArray=[];  
          this.optionsArray=[];   
          console.log('sss',this.questionForm.value.JRSS)
          this.questionForm.value.skill=this.questionForm.value.skill
          if(this.questionForm.value.option1checkbox){
            this.answerArray.push("1");}
          if(this.questionForm.value.option2checkbox){
            this.answerArray.push("2");}
            if(this.questionForm.value.option3checkbox){
              this.answerArray.push("3");}
              if(this.questionForm.value.option4checkbox){
                this.answerArray.push("4");}                
                this.questionForm.value.answerID=this.answerArray.toString();
               this.optionsArray.push({optionID:1,option:this.questionForm.value.option1},
                {optionID:2,option:this.questionForm.value.option2},
                {optionID:3,option:this.questionForm.value.option3},
                {optionID:4,option:this.questionForm.value.option4});         
              this.questionForm.value.options=this.optionsArray;
                //Validation for singleSelect
                if((this.questionForm.value.questionType=="SingleSelect")&& (this.answerArray.toString().length)>1)
                {console.log("only one"+this.questionForm.value.answerID)
                alert("Only one option can be selected as the questionType is SingleSelect");                
                return false;
              }       
              this.questionID++;                
              this.questionForm.value.questionID=this.questionID;
              
          this.apiService.createQuestion(this.questionForm.value).subscribe(
            (res) => {
              console.log('Question successfully created!');
              window.confirm('Succesfully added to QuestionBank');
              this.ngZone.run(() => this.router.navigateByUrl('/manage-questionbank'))
              this.questionForm.reset();
            }, (error) => {
              console.log(error);
            }); 
        }
      }

}
