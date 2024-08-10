export const seedParams = `
INSERT INTO public."parameter"
(code, "name", category, is_public, description)
VALUES('SYSTEMADMIN', 'SYSTEMADMIN', 'role', false, 'SYSTEMADMIN');
INSERT INTO public."parameter"
(code, "name", category, is_public, description)
VALUES('SUPERADMIN', 'SUPERADMIN', 'role', true, 'SUPERADMIN');
INSERT INTO public."parameter"
(code, "name", category, is_public, description)
VALUES('LEADER', 'LEADER', 'role', true, 'LEADER');
INSERT INTO public."parameter"
(code, "name", category, is_public, description)
VALUES('DISCIPLES', 'DISCIPLES', 'role', true, 'DISCIPLES');
`;
