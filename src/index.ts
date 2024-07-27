import {
    CreateUserInput,
    Email,
    Group,
    Membership,
    Person,
} from "./types/planning-center";

export class PlanningCenterClient {
    private baseUrl: string;
    private authHeader: string;

    constructor() {
        this.baseUrl = "https://api.planningcenteronline.com";
        this.authHeader =
            "Basic " +
            btoa(
                `${process.env["PCO_APP_ID"]}:${process.env["PCO_APP_SECRET"]}`
            );
    }

    private async get<T>(
        subpath: string,
        queryParams?: Record<string, string | number | boolean>
    ): Promise<T> {
        const url = new URL(`${this.baseUrl}/${subpath}`);

        if (queryParams) {
            Object.keys(queryParams).forEach((key) => {
                url.searchParams.append(key, String(queryParams[key]));
            });
        }

        return this.handleRequest<T>(url.toString(), { method: "GET" });
    }

    private async post<T>(subpath: string, data: any): Promise<T> {
        return this.handleRequest<T>(`${this.baseUrl}/${subpath}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
    }

    private async delete<T>(subpath: string): Promise<T> {
        return this.handleRequest<T>(`${this.baseUrl}/${subpath}`, {
            method: "DELETE",
        });
    }

    private async handleRequest<T>(
        url: string,
        options: RequestInit
    ): Promise<T> {
        const response = await fetch(url, {
            ...options,
            headers: {
                ...options.headers,
                Authorization: this.authHeader,
            },
        });
        return this.handleResponse<T>(response);
    }

    private async handleResponse<T>(response: Response): Promise<T> {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json() as Promise<T>;
    }

    public async getGroupById(groupId: string | number) {
        return this.get<{ data: Group }>(`groups/v2/groups/${groupId}`);
    }

    public async getPersonByEmail(email: string): Promise<{ data: Person[] }> {
        return this.get("people/v2/people", {
            include: "emails",
            "where[search_name_or_email_or_phone_number]": email,
        });
    }

    public async getPersonById(
        id: string | number
    ): Promise<{ data: Person[] }> {
        return this.get(`people/v2/people/${id}`);
    }

    public async getPersonsEmailById(
        id: string | number
    ): Promise<{ data: Email[] }> {
        return this.get(`people/v2/people/${id}/emails`);
    }

    public async getGroupMembers(
        groupId: string | number
    ): Promise<{ data: [Membership] }> {
        return this.get(`groups/v2/groups/${groupId}/memberships`);
    }

    public async requestGroupEnrollment(groupId: string | number) {
        return this.post(
            `groups/v2/group_types/unique/groups/${groupId}/enroll`,
            {}
        );
    }

    public async getGroup(groupId: string | number): Promise<{ data: Group }> {
        return this.get(`groups/v2/groups/${groupId}`);
    }

    public async getGroupLeaderEmails(
        groupId: string | number
    ): Promise<{ data: string[] }> {
        const members = await this.getGroupMembers(groupId);

        const leaders = members.data.filter(
            (member) => member.attributes.role === "leader"
        );

        if (leaders.length < 1) return { data: [] };

        const ids = leaders.map(
            (leader) => leader.relationships.person.data.id
        );

        const results = await Promise.all(
            ids.map(async (id) => {
                try {
                    const response = await this.getPersonsEmailById(id);
                    const email = response?.data?.find(
                        (email) => email.attributes.primary
                    );
                    if (!email) return;
                    return email.attributes.address;
                } catch (error) {
                    throw new Error(`Error fetching data: ${error}`);
                }
            })
        );

        return { data: results.filter((item) => item) as string[] };
    }

    public async updateUserEmail(id: string, email: string) {
        return this.post<{ data: Person }>(
            `people/v2/people/${parseInt(id)}/emails`,
            {
                data: {
                    type: "Email",
                    attributes: {
                        address: email,
                        location: "Home",
                        primary: true,
                    },
                },
            }
        );
    }

    public async createUser(info: Partial<CreateUserInput>) {
        return this.post<{ data: Person }>("people/v2/people", {
            data: {
                type: "Person",
                attributes: info,
            },
        });
    }
}
