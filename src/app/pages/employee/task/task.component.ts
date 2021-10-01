import { Component, OnInit } from '@angular/core';
import { GoalService } from 'src/app/services/goal/goal.service';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css'],
})
export class TaskComponent implements OnInit {
  user: any;
  goals: any[];
  selectedGoal: any;

  constructor(private goalService: GoalService) {
    this.user = JSON.parse(localStorage.getItem('currentUser'));
  }

  ngOnInit(): void {
    this.goalService.getAllGoalsByCompanyId(this.user.companyId).subscribe(
      (response) => {
        this.goals = response.goals;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  handleGoalSelection() {
    if (!!this.selectedGoal) {
      console.log(this.selectedGoal.goalId);
    }
  }
}