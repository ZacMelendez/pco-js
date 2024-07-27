"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlanningCenterClient = void 0;
class PlanningCenterClient {
    constructor() {
        this.baseUrl = "https://api.planningcenteronline.com";
        this.authHeader =
            "Basic " +
                btoa(`${process.env["PCO_APP_ID"]}:${process.env["PCO_APP_SECRET"]}`);
    }
    get(subpath, queryParams) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = new URL(`${this.baseUrl}/${subpath}`);
            if (queryParams) {
                Object.keys(queryParams).forEach((key) => {
                    url.searchParams.append(key, String(queryParams[key]));
                });
            }
            return this.handleRequest(url.toString(), { method: "GET" });
        });
    }
    post(subpath, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.handleRequest(`${this.baseUrl}/${subpath}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });
        });
    }
    delete(subpath) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.handleRequest(`${this.baseUrl}/${subpath}`, {
                method: "DELETE",
            });
        });
    }
    handleRequest(url, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(url, Object.assign(Object.assign({}, options), { headers: Object.assign(Object.assign({}, options.headers), { Authorization: this.authHeader }) }));
            return this.handleResponse(response);
        });
    }
    handleResponse(response) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        });
    }
    getGroupById(groupId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.get(`groups/v2/groups/${groupId}`);
        });
    }
    getPersonByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.get("people/v2/people", {
                include: "emails",
                "where[search_name_or_email_or_phone_number]": email,
            });
        });
    }
    getPersonById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.get(`people/v2/people/${id}`);
        });
    }
    getPersonsEmailById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.get(`people/v2/people/${id}/emails`);
        });
    }
    getGroupMembers(groupId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.get(`groups/v2/groups/${groupId}/memberships`);
        });
    }
    requestGroupEnrollment(groupId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.post(`groups/v2/group_types/unique/groups/${groupId}/enroll`, {});
        });
    }
    getGroup(groupId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.get(`groups/v2/groups/${groupId}`);
        });
    }
    getGroupLeaderEmails(groupId) {
        return __awaiter(this, void 0, void 0, function* () {
            const members = yield this.getGroupMembers(groupId);
            const leaders = members.data.filter((member) => member.attributes.role === "leader");
            if (leaders.length < 1)
                return { data: [] };
            const ids = leaders.map((leader) => leader.relationships.person.data.id);
            const results = yield Promise.all(ids.map((id) => __awaiter(this, void 0, void 0, function* () {
                var _a;
                try {
                    const response = yield this.getPersonsEmailById(id);
                    const email = (_a = response === null || response === void 0 ? void 0 : response.data) === null || _a === void 0 ? void 0 : _a.find((email) => email.attributes.primary);
                    if (!email)
                        return;
                    return email.attributes.address;
                }
                catch (error) {
                    throw new Error(`Error fetching data: ${error}`);
                }
            })));
            return { data: results.filter((item) => item) };
        });
    }
    updateUserEmail(id, email) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.post(`people/v2/people/${parseInt(id)}/emails`, {
                data: {
                    type: "Email",
                    attributes: {
                        address: email,
                        location: "Home",
                        primary: true,
                    },
                },
            });
        });
    }
    createUser(info) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.post("people/v2/people", {
                data: {
                    type: "Person",
                    attributes: info,
                },
            });
        });
    }
}
exports.PlanningCenterClient = PlanningCenterClient;
