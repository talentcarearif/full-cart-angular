import { State, Selector, Action, StateContext } from "@ngxs/store";
import { Login, Logout } from "../actions/auth.action";
import { AuthModel } from "../models/auth.model";
import { Injectable } from "@angular/core";


export class AuthStateModel {
    auth!: AuthModel;
}
  
  @State<AuthStateModel>({
    name: "auth",
    defaults: {
      auth: {
        isAuthenticated: false,
        token: '',
        message: '',
        userInformation: {
          userName : '',
          userEmail : '',
          userMobile : '',
          userRole : '',
          userAddress : ''
        }
      }
    }
  })

  @Injectable({
    providedIn: 'root',
  })
  
  export class AuthState { 
    @Selector()
    static isLoggedIn(state: AuthStateModel): boolean {
      return state.auth.isAuthenticated;
    }
  
    @Selector()
    static getAuthInfo(state: AuthStateModel): AuthModel {
      return state.auth;
    }

    @Action(Login)
    login({ setState }: StateContext<AuthStateModel>, { payload }: Login) {
        setState({ auth: payload });
    }

    @Action(Logout)
    logout({ setState }: StateContext<AuthStateModel>, {}: Logout) {
        setState({
        auth: {
            isAuthenticated: false,
            token: '',
            message: '',
            userInformation: {
              userName : '',
              userEmail : '',
              userMobile : '',
              userRole : '',
              userAddress: ''
            }
        }
        });
    }

  }
