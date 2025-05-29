import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatSidenav } from '@angular/material/sidenav';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    SidebarComponent
  ],
  template: `
    <div class="main-layout">
      <app-header (sidebarToggle)="toggleSidebar()"></app-header>
      
      <app-sidebar 
        [isOpen]="sidebarOpen" 
        [sidenavMode]="sidenavMode"
        class="sidebar-container">
        <div class="content-container">
          <main class="main-content">
            <router-outlet></router-outlet>
          </main>
        </div>
      </app-sidebar>
    </div>
  `,
  styles: [`
    .main-layout {
      height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .sidebar-container {
      flex: 1;
      overflow: hidden;
    }

    .content-container {
      height: 100%;
      overflow: auto;
    }

    .main-content {
      padding: 24px;
      min-height: calc(100vh - 64px);
      background-color: #f5f5f5;
    }

    @media (max-width: 768px) {
      .main-content {
        padding: 16px;
      }
    }
  `]
})
export class MainLayoutComponent implements OnInit {
  sidebarOpen = true;
  sidenavMode: 'over' | 'push' | 'side' = 'side';

  constructor(private breakpointObserver: BreakpointObserver) {}

  ngOnInit(): void {
    this.breakpointObserver.observe([Breakpoints.Handset])
      .subscribe(result => {
        if (result.matches) {
          this.sidenavMode = 'over';
          this.sidebarOpen = false;
        } else {
          this.sidenavMode = 'side';
          this.sidebarOpen = true;
        }
      });
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }
}
