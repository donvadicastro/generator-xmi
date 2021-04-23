import './env';
import Server from './server';
import routes from './routes';

export default new Server()
  .router(routes)
  .listen(parseInt(process.env.PORT || '3000'));
