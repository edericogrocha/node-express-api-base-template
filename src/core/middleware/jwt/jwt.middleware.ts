import { Request, Response, NextFunction } from 'express';
import { JwtLib } from '../../../core/libraries/jwt/jwt.lib';
import { AuthLib } from '../../../core/libraries/auth/auth.lib';

export class JwtMiddleware {
  private jwt: JwtLib;

  constructor(){
    this.reqToken = this.reqToken.bind(this);
    this.requiredToken = this.requiredToken.bind(this);
    this.jwt = new JwtLib();
  }

  /**
   * [reqToken description] - check if token is present on headers request
   *                           and if token is valid
   * @param  req  [description] - tipical Nodejs Request param
   * @param  res  [description] - tipical Nodejs Response param
   * @param  next [description] - tipical Nodejs NextFunction param
   */
  public reqToken(req: Request, res: Response, next: NextFunction){
    if(req.headers.hasOwnProperty('token')){
      if(!this.jwt.isValid(req.headers.token.toString())){
        res.status(401).json({
          error: 'Unauthorized'
        });
      }else{
        next();
      }
    }else{
      res.status(401).json({
        error: 'Unauthorized'
      });
    }
  }

  /**
   * [requiredToken description] - check if token is present on headers request
   *                           and if token is valid
   * @param  req  [description] - tipical Nodejs Request param
   * @param  res  [description] - tipical Nodejs Response param
   * @param  next [description] - tipical Nodejs NextFunction param
   */
  public requiredToken(req: Request, res: Response, next: NextFunction){
    if(req.headers.hasOwnProperty('token')){
      if(!this.jwt.isValid(req.headers.token.toString())){
        res.status(401).json({
          error: 'Unauthorized'
        });
      }else{
        let decodedToken = this.jwt.decode(req.headers.token.toString());
        if(decodedToken.data != '' && decodedToken.data != undefined){
          next();
        }else{
          res.status(401).json({
            error: 'Unauthorized',
            message: 'Your token is not valid'
          });
        }
      }
    }else{
      res.status(401).json({
        error: 'Unauthorized'
      });
    }
  }



  /**
   * [isAuthenticated description]
   * @param  req  [description]
   * @param  res  [description]
   * @param  next [description]
   * @return      [description]
   */
  public isAuthenticated(req: Request, res: Response, next: NextFunction){
    AuthLib.issetAuthHeader() ? next() : res.status(401).json({
      error: 'Unauthorized request'
    });
  }

}

export default new JwtMiddleware();
