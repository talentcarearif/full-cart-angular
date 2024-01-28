export interface AuthModel {
    isAuthenticated: boolean;
    userInformation: {
        userName : string
        userEmail : string
        userMobile : string
        userRole : string,
        userAddress : string
   }
   token: string; 
   message: string; 
}