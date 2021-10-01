import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { CompanyDetailsService } from 'src/app/services/company/company-details.service';
import { UserService } from 'src/app/services/user/user.service';
import { AlternateWorkTeamsConfigurationService } from './../../../../services/wfoConfiguration/alternate-work-teams-configuration/alternate-work-teams-configuration.service';

@Component({
  selector: 'app-admin-alternate-work-teams-config',
  templateUrl: './alternateWorkTeamsConfig.component.html',
  styleUrls: ['./alternateWorkTeamsConfig.component.css'],
  providers: [MessageService],
})
export class AlternateWorkTeamsConfigComponent implements OnInit {
  company: any | null;
  alternateWorkTeamsConfigurationId: number;
  alternateWorkTeamsConfig: any | null;

  teamAUsers: any | null;
  teamBUsers: any | null;

  isLoading: boolean = false;
  isHovering: boolean = false;
  teamA: any | null = [];
  teamB: any | null = [];

  selectedEmployeeTeamA: any | null;
  selectedEmployeeTeamB: any | null;

  isDailySelected: boolean = false;
  isWeeklySelected: boolean = false;
  isBiWeeklySelected: boolean = false;
  isMonthlySelected: boolean = false;

  isDailyConfigFirstClicked: boolean = true;
  isWeeklyConfigFirstClicked: boolean = true;
  isBiweeklyConfigFirstClicked: boolean = true;
  isMonthlyConfigFirstClicked: boolean = true;

  selectedConfig: String;

  constructor(
    private _location: Location,
    private messageService: MessageService,
    private companyDetailsService: CompanyDetailsService,
    private userService: UserService,
    private alternateWorkTeamsConfigurationService: AlternateWorkTeamsConfigurationService
  ) {}

  ngOnInit(): void {
    const currentUser = localStorage.getItem('currentUser');

    if (currentUser) {
      const { companyId } = JSON.parse(currentUser);
      this.companyDetailsService.getCompanyById(companyId).subscribe(
        (result) => {
          this.company = result.company;

          if (this.company.alternateWorkTeamsConfigurationId === null) {
            this.alternateWorkTeamsConfigurationId = null;
            this.isDailySelected = true;
            this.isDailyConfigFirstClicked = false;
            this.isLoading = false;
          } else {
            this.alternateWorkTeamsConfigurationService
              .getAlternateWorkTeamsConfiguration(
                this.company.alternateWorkTeamsConfigurationId
              )
              .subscribe((response) => {
                this.alternateWorkTeamsConfigurationId =
                  this.company.alternateWorkTeamsConfigurationId;
                this.alternateWorkTeamsConfig =
                  response.alternateWorkTeamsConfig;
                this.teamA = this.alternateWorkTeamsConfig.teamA;
                this.teamB = this.alternateWorkTeamsConfig.teamB;
                this.selectedConfig =
                  this.alternateWorkTeamsConfig.scheduleType;

                if (this.selectedConfig === 'DAILY') {
                  this.isDailySelected = true;
                  this.isDailyConfigFirstClicked = false;
                } else if (this.selectedConfig === 'WEEKLY') {
                  this.isWeeklySelected = true;
                  this.isWeeklyConfigFirstClicked = false;
                } else if (this.selectedConfig === 'BIWEEKLY') {
                  this.isBiWeeklySelected = true;
                  this.isBiweeklyConfigFirstClicked = false;
                } else if (this.selectedConfig === 'MONTHLY') {
                  this.isMonthlySelected = true;
                  this.isMonthlyConfigFirstClicked = false;
                }

                this.userService.getUsers(companyId).subscribe((response) => {
                  const populateTeamAArr = [];
                  const populateTeamBArr = [];
                  for (let user of response.users) {
                    const userModel = {
                      userId: user.userId,
                      fullName: user.fullName,
                      isVaccinated: user.isVaccinated,
                    };

                    const insideTeamA = this.teamA.find(
                      (item) => item.userId === userModel.userId
                    );
                    const insideTeamB = this.teamB.find(
                      (item) => item.userId === userModel.userId
                    );
                    if (!insideTeamA && !insideTeamB) {
                      populateTeamAArr.push(userModel);
                      populateTeamBArr.push(userModel);
                    }
                  }

                  this.teamAUsers = populateTeamAArr;
                  this.teamBUsers = populateTeamBArr;
                });
              });
          }
        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Company not found',
          });
        }
      );
    }
  }

  onBackClick(): void {
    this._location.back();
  }

  addToTeamA(formValue: NgForm): void {
    const userToAdd = formValue.value.selectedEmployeeTeamA;
    this.teamA.push(userToAdd);

    //Remove user so that he cannot be selected for team B
    const indexToRemove = this.teamBUsers.indexOf(userToAdd);
    this.teamBUsers.splice(indexToRemove, 1);
    this.teamAUsers.splice(indexToRemove, 1);

    formValue.resetForm();
  }

  addToTeamB(formValue: NgForm): void {
    const userToAdd = formValue.value.selectedEmployeeTeamB;
    this.teamB.push(userToAdd);

    //Remove user so that he cannot be selected for team A
    const indexToRemove = this.teamAUsers.indexOf(userToAdd);
    this.teamAUsers.splice(indexToRemove, 1);
    this.teamBUsers.splice(indexToRemove, 1);

    formValue.resetForm();
  }

  onTeamAEmployeeDelete(employee: any): void {
    const indexToRemove = this.teamA.indexOf(employee);
    this.teamA.splice(indexToRemove, 1);

    //Add removed user back to selectable list
    this.teamAUsers.push(employee);
    this.teamBUsers.push(employee);
  }

  onTeamBEmployeeDelete(employee: any): void {
    const indexToRemove = this.teamB.indexOf(employee);
    this.teamB.splice(indexToRemove, 1);

    //Add removed user back to selectable list
    this.teamBUsers.push(employee);
    this.teamAUsers.push(employee);
  }

  selectDailyConfig(): void {
    this.selectedConfig = 'DAILY';
    if (this.isDailyConfigFirstClicked) {
      this.isDailySelected = true;
      this.isWeeklySelected = false;
      this.isBiWeeklySelected = false;
      this.isMonthlySelected = false;

      this.isDailyConfigFirstClicked = false;
      this.isWeeklyConfigFirstClicked = true;
      this.isBiweeklyConfigFirstClicked = true;
      this.isMonthlyConfigFirstClicked = true;
    } else {
      const tempTeamA = this.teamA;
      this.teamA = this.teamB;
      this.teamB = tempTeamA;

      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Members of Teams A and B have been swapped.',
      });
    }
  }

  selectWeeklyConfig(): void {
    this.selectedConfig = 'WEEKLY';
    if (this.isWeeklyConfigFirstClicked) {
      this.isDailySelected = false;
      this.isWeeklySelected = true;
      this.isBiWeeklySelected = false;
      this.isMonthlySelected = false;

      this.isDailyConfigFirstClicked = true;
      this.isWeeklyConfigFirstClicked = false;
      this.isBiweeklyConfigFirstClicked = true;
      this.isMonthlyConfigFirstClicked = true;
    } else {
      const tempTeamA = this.teamA;
      this.teamA = this.teamB;
      this.teamB = tempTeamA;

      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Members of Teams A and B have been swapped.',
      });
    }
  }

  selectBiweeklyConfig(): void {
    this.selectedConfig = 'BIWEEKLY';
    if (this.isBiweeklyConfigFirstClicked) {
      this.isDailySelected = false;
      this.isWeeklySelected = false;
      this.isBiWeeklySelected = true;
      this.isMonthlySelected = false;

      this.isDailyConfigFirstClicked = true;
      this.isWeeklyConfigFirstClicked = true;
      this.isBiweeklyConfigFirstClicked = false;
      this.isMonthlyConfigFirstClicked = true;
    } else {
      const tempTeamA = this.teamA;
      this.teamA = this.teamB;
      this.teamB = tempTeamA;

      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Members of Teams A and B have been swapped.',
      });
    }
  }

  selectMonthlyConfig(): void {
    this.selectedConfig = 'MONTHLY';
    if (this.isMonthlyConfigFirstClicked) {
      this.isDailySelected = false;
      this.isWeeklySelected = false;
      this.isBiWeeklySelected = false;
      this.isMonthlySelected = true;

      this.isDailyConfigFirstClicked = true;
      this.isWeeklyConfigFirstClicked = true;
      this.isBiweeklyConfigFirstClicked = true;
      this.isMonthlyConfigFirstClicked = false;
    } else {
      const tempTeamA = this.teamA;
      this.teamA = this.teamB;
      this.teamB = tempTeamA;

      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Members of Teams A and B have been swapped.',
      });
    }
  }

  createAlternateWorkTeamsConfiguration() {
    const newConfig = {
      scheduleType: this.selectedConfig,
      teamA: this.teamA,
      teamB: this.teamB,
    };

    //Bind employee to the team they belong to
    for (let user of this.teamA) {
      const wfoTeamAllocation = {
        userId: user.userId,
        fullName: user.fullName,
        alternateWfoTeam: 'A',
      };
      this.userService
        .updateUserDetailsByUserId(user.userId, wfoTeamAllocation)
        .subscribe(
          (response) => {},
          (error) => {}
        );
    }

    for (let user of this.teamB) {
      const wfoTeamAllocation = {
        userId: user.userId,
        fullName: user.fullName,
        alternateWfoTeam: 'B',
      };
      this.userService
        .updateUserDetailsByUserId(user.userId, wfoTeamAllocation)
        .subscribe(
          (response) => {},
          (error) => {}
        );
    }

    //Create Alternate Work Teams Config and Bind to Company
    this.alternateWorkTeamsConfigurationService
      .createAlternateWorkTeamsConfiguration(newConfig)
      .subscribe((response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Alternate Work Teams Configuration has been added.',
        });

        this.alternateWorkTeamsConfigurationId =
          response.alternateWorkTeamsConfig.alternateWorkTeamsConfigurationId;

        const updateCompany = {
          ...this.company,
          alternateWorkTeamsConfigurationId:
            this.alternateWorkTeamsConfigurationId,
        };

        this.companyDetailsService.updateCompany(updateCompany).subscribe(
          (response) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail:
                'Alternate Work Teams Configuration has been binded to the company.',
            });
          },
          (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Problem adding configuration. Please try again.',
            });
          }
        );
      });
  }

  updateAlternateWorkTeamsConfiguration() {
    const newConfig = {
      alternateWorkTeamsConfigurationId: this.alternateWorkTeamsConfigurationId,
      scheduleType: this.selectedConfig,
      teamA: this.teamA,
      teamB: this.teamB,
    };

    //Bind employee to the team they belong to
    for (let user of this.teamA) {
      const wfoTeamAllocation = {
        userId: user.userId,
        fullName: user.fullName,
        alternateWfoTeam: 'A',
      };
      this.userService
        .updateUserDetailsByUserId(user.userId, wfoTeamAllocation)
        .subscribe(
          (response) => {},
          (error) => {}
        );
    }

    for (let user of this.teamB) {
      const wfoTeamAllocation = {
        userId: user.userId,
        fullName: user.fullName,
        alternateWfoTeam: 'B',
      };
      this.userService
        .updateUserDetailsByUserId(user.userId, wfoTeamAllocation)
        .subscribe(
          (response) => {},
          (error) => {}
        );
    }

    this.alternateWorkTeamsConfigurationService
      .updateAlternateWorkTeamsConfiguration(newConfig)
      .subscribe(
        (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Alternate Work Teams Configuration has been updated.',
          });
        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Problem updating configuration. Please try again.',
          });
        }
      );
  }

  onSave(): void {
    if (this.alternateWorkTeamsConfigurationId === null) {
      this.createAlternateWorkTeamsConfiguration();
    } else {
      this.updateAlternateWorkTeamsConfiguration();
    }
  }
}