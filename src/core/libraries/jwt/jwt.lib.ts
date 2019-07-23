import * as jsonwebtoken from 'jsonwebtoken';
import { default as config } from '../../../config/index';

export class JwtLib {
  private privateKey: string;

  constructor(){
    this.privateKey = config.encryption.key;
  }

  /**
   * [isExpired description] 
   * @param  token [description] - jwt token
   * @return      [description] - boolean, true if token param has expired
   */
  public isExpired(token: string){
    jsonwebtoken.verify(token, this.privateKey, (err, decoded) => {
      if(err){
        return err.name == 'TokenExpiredError';
      }
      return false;
    });
  }

  /**
   * [isValid description] 
   * @param  token [description] - jwt token
   * @return      [description] - boolean, true if token param is valid
   */
  public isValid(token: string){
    return jsonwebtoken.verify(token, this.privateKey, (err, decoded) => {
      return err ? false : true;
    });
  }

  /**
   * [validate description] 
   * @param  token [description] - jwt token
   * @return      [description] - boolean, true if token param is valid
   */
  public validate(token: string){
    jsonwebtoken.verify(token, this.privateKey, (err, decoded) => {
      if(err){
        return err.message;
      }
      return 'isValid';
    });
  }

  /**
   * [decode description] - decode token
   * @param  token [description]
   * @return       [description]
   */
  public decode(token: string){
    return jsonwebtoken.verify(token, this.privateKey);
  }

  /**
   * [create description] - create a session token
   * @param  tokenData  [description] - payload data to create the token
   * @return            [description] - a jwt token, with a valid session
   */
  public create(tokenData: any){
    return jsonwebtoken.sign({
      data: tokenData.username
    },
    this.privateKey,
    tokenData.exp);
  }

}