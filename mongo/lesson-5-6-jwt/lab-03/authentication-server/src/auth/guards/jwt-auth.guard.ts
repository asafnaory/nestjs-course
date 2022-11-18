import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
	canActivate(context: ExecutionContext) {
	  // Add your custom authentication logic here
	  // for example, call super.logIn(request) to establish a session.
	  return super.canActivate(context);
	}
  
	handleRequest(err, user, info) {
	  // You can throw an exception based on either "info" or "err" arguments
	  if (err || !user) {
		throw err || new UnauthorizedException();
	  }
	  return user;
	}
}
/**
 * we're applying the AuthGuard that the @nestjs/passport module has automatically provisioned
 * for us when we configured the passport-jwt module. This Guard is referenced by its default name, jwt
 */
