// creates custom global variables before running tests to avoid errors
const localStorageMock = {
	getItem: jest.fn(),
	setItem: jest.fn(),
	clear: jest.fn()
};
// to avoid localStorage errors
global.localStorage = localStorageMock;
// to avoid network error with axios
global.XMLHttpRequest = undefined;
