import { faker } from "@faker-js/faker";

export function generateFakeUser() {
    const tempDomains = ["1secmail.com", "1secmail.net", "1secmail.org"];
    const username = faker.internet.username().toLowerCase();
    const domain = faker.helpers.arrayElement(tempDomains);

    return {
        name: faker.person.fullName(),
        email: `${username}@${domain}`,
        username,
        password: faker.internet.password({ length: 12 }),
        avatar: faker.image.avatar(),
        bio: faker.lorem.sentence(),
    };
}
