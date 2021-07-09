import HomePage from '../pages/Home/Home';
// Interfaces
import IRoute from '../interfaces/route';

const routes: IRoute[] = [
  {
		path: '/',
		name: 'Home',
		component: HomePage,
		exact: true
	},
]

export default routes;
