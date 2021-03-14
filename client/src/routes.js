import Home from './components/Home.vue';
import Projects from './components/Projects.vue';
import Project from './components/Project.vue';
import Collections from './components/Collections.vue';
import Collection from './components/Collection.vue';

export const routes = [
	{ path: '/', component: Home },
	{ path: '/projects', component: Projects },
	{ path: '/projects/:projectId', props: true, component: Project,
		children: []
	},
	{ path: '/projects/:projectId/collections', props: true, component: Collections },
	{ path: '/projects/:projectId/collections/:collectionId', props: true, component: Collection },
];