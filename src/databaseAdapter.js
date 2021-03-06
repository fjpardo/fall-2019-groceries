const request = require('request');
var sleep = require('system-sleep');

class DatabaseAdapter {
	constructor() {
		this.baseEndpoint = 'http://localhost:4000/';
	}

	async addUser(user) {
		const endpoint = this.baseEndpoint + 'users/add/';
		var userData = {};

		// populate user data
		userData["username"] = user.getUsername();
		userData["password"] = user.getPassword();

		const userAddress = user.getAddress();
		userData["first_name"] = userAddress.getFirstName();
		userData["last_name"] = userAddress.getLastName();
		userData["address_1"] = userAddress.getAddressLine1();
		userData["phone_number"] = userAddress.getPhoneNumber();
		userData["address_2"] = userAddress.getAddressLine2();
		userData["zip_code"] = userAddress.getZipCode();
		userData["city"] = userAddress.getCity();
		userData["state"] = userAddress.getState();
		userData["country"] = userAddress.getCountry();
    

		// send GET without blocking
		var response = await this.sendPostRequest(userData, endpoint);
		console.log("response from adding "+response);
		return response;
	}

	async getUserData(user) {
		const endpoint = this.baseEndpoint + 'users/' + user.getId();

		// get user data without blocking
		var userData = await this.sendGetRequest(endpoint);
		userData = JSON.parse("[" + userData + "]")[0][0];
		return userData;
	}

	async getUserAliases(user) {
		const endpoint = this.baseEndpoint + 'aliases/' + user.getId();
		
		// get user aliases without blocking
		var userAliasJSON = await this.sendGetRequest(endpoint);
		userAliasJSON = JSON.parse("[" + userAliasJSON + "]")[0];
		return userAliasJSON;
	}

	async setUserAliases(user, aliases) {
		var userAliases = {'aliases': []};
		const endpoint = this.baseEndpoint + 'aliases/update/' + user.getId();

		for (let alias of aliases) {
			var aliasEntry = {};
			aliasEntry["name"] = alias.getName();
			aliasEntry["link"] = alias.getItem().getLink();
			userAliases['aliases'].push(aliasEntry);
		}

		var success = await this.sendPostRequest(userAliases, endpoint);
	}

	async setUserAliasesFromJSON(user, aliases) {
		var userAliases = {'aliases': aliases};
		const endpoint = this.baseEndpoint + 'aliases/update/' + user.getId();
		var success = await this.sendPostRequest(userAliases, endpoint);
	}

	async getCartAliases(user) {
		const endpoint = this.baseEndpoint + 'cartAliases/' + user.getId();
		var cartAliasesJSON = await this.sendGetRequest(endpoint);
		cartAliasesJSON = JSON.parse("[" + cartAliasesJSON  + "]")[0];
		return cartAliasesJSON;
	}

	async setCartAliasesFromJSON(user, aliases) {
		var userAliases = {'cartAliases': aliases};
		const endpoint = this.baseEndpoint + 'cartAliases/update/' + user.getId();
		await this.sendPostRequest(userAliases, endpoint);
	}

	async getUserCart(user) {
		const endpoint = this.baseEndpoint + 'carts/' + user.getId();

		
		// get user's cart without blocking
		var userCartJSON = await this.sendGetRequest(endpoint);
		userCartJSON = JSON.parse("[" + userCartJSON  + "]")[0];
		return userCartJSON;
	}

	async setUserCartFromJSON(user, cartJSON) {
		const endpoint = this.baseEndpoint + 'carts/update/' + user.getId();
		var result = await this.sendPostRequest(cartJSON, endpoint);
		return result;
	}

	async setUserCart(user, cart) {
		var cartItems = {'items': []};
		const endpoint = this.baseEndpoint + 'carts/update/' + user.getId();

		for (let cartItem of cart.getItems().values()) {			
			var itemEntry = {};
			const item = cartItem.getItem();
			itemEntry["name"] = item.getName();
			itemEntry["quantity"] = cartItem.getQuantity();
			cartItems['items'].push(itemEntry);
		}

		var success = await this.sendPostRequest(cartItems, endpoint);
	}

	async getUserItems(user) {
		const endpoint = this.baseEndpoint + "items/" + user.getId();
		var userItems = await this.sendGetRequest(endpoint);
		userItems = JSON.parse("[" + userItems  + "]")[0];
		return userItems;
	}

	async setUserItems(user, items) {
		var userItems = {'itemsInfo': []};
		const endpoint = this.baseEndpoint + 'items/update/' + user.getId();

		for (let item of items) {
			var itemEntry = {};
			itemEntry["id"] = item.getId();
			itemEntry["name"] = item.getName();
			itemEntry["cost"] = item.getCost();
			itemEntry["link"] = item.getLink();
			userItems["itemsInfo"].push(itemEntry);
		}

		var result = await this.sendPostRequest(userItems, endpoint);
	}

	async sendGetRequest(endpoint) {
		return new Promise((resolve, reject) => {			
			request(endpoint, function(err, res, body) {				
				return resolve(body);
			});	
		});	
	}

	async sendPostRequest(requestBody, endpoint) {
		return new Promise((resolve, reject) => {
			request.post({url: endpoint, json: requestBody}, 
				function(err, httpResponse, body) {
					return resolve(body);
				}
			);
		});	
	}
}

module.exports = {
	DatabaseAdapter
};