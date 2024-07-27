export interface Person {
    type: "Person";
    id: string;
    attributes: PersonAttributes;
    relationships: PersonRelationships;
}

export interface Membership {
    type: "Membership";
    id: string;
    attributes: {
        joined_at: string;
        role: string;
    };
    relationships: {
        group: {
            data: {
                type: "Group";
                id: string;
            };
        };
        person: {
            data: {
                type: "Person";
                id: string;
            };
        };
    };
}

export interface Email {
    type: "Email";
    id: string;
    attributes: EmailAttributes;
    relationships: RelationshipData<"Person">;
}

interface EmailAttributes {
    address: string;
    location: string;
    primary: boolean;
    created_at: string;
    updated_at: string;
    blocked: boolean;
}

export type CreateUserInput = Pick<
    PersonAttributes,
    | "accounting_administrator"
    | "anniversary"
    | "birthdate"
    | "child"
    | "given_name"
    | "grade"
    | "graduation_year"
    | "last_name"
    | "middle_name"
    | "nickname"
    | "people_permissions"
    | "site_administrator"
    | "gender"
    | "inactivated_at"
    | "medical_notes"
    | "membership"
    | "avatar"
    | "first_name"
    | "remote_id"
    | "status"
>;

interface PersonAttributes {
    avatar: string;
    demographic_avatar_url: string;
    first_name: string;
    name: string;
    status: string;
    remote_id: number;
    accounting_administrator: boolean;
    anniversary: string;
    birthdate: string;
    child: boolean;
    given_name: string;
    grade: number;
    graduation_year: number;
    last_name: string;
    middle_name: string;
    nickname: string;
    people_permissions: string;
    site_administrator: boolean;
    gender: string;
    inactivated_at: string;
    medical_notes: string;
    membership: string;
    created_at: string;
    updated_at: string;
    can_create_forms: boolean;
    can_email_lists: boolean;
    directory_shared_info: Record<string, unknown>;
    directory_status: string;
    passed_background_check: boolean;
    resource_permission_flags: Record<string, unknown>;
    school_type: string;
    mfa_configured: boolean;
}

interface PersonRelationships {
    primary_campus: RelationshipData<"PrimaryCampus">;
    gender: RelationshipData<"Gender">;
}

interface RelationshipData<T extends string> {
    T: {
        data: {
            type: T;
            id: string;
        };
    };
}

export interface Group {
    type: "Group";
    id: string;
    attributes: GroupAttributes;
    relationships: GroupRelationships;
}

interface GroupAttributes {
    archived_at: string;
    contact_email: string;
    created_at: string;
    description: string;
    events_visibility: string;
    header_image: Record<string, unknown>;
    location_type_preference: string;
    memberships_count: number;
    name: string;
    public_church_center_web_url: string;
    schedule: string;
    virtual_location_url: string;
    widget_status: Record<string, unknown>;
}

interface GroupRelationships {
    group_type: RelationshipData<"GroupType">;
    location: RelationshipData<"Location">;
}
