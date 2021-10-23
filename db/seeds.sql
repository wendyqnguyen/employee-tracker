INSERT INTO department (name)
VALUES
('Management'),
('Operations'),
('Marketing and Sales'),
('Research and Development'),
('Finance')

INSERT INTO role (title, salary, department_id)
VALUES
  ('Administrative Assistant', 65000, 2),
  ('Executive Assistant', 77000, 2), 
  ('Marketing Manager', 170000, 3),
  ('Customer Service Rep', 59000, 3),
  ('IT', 150000, 4),
  ('Software Engineer', 125000, 4),
  ('Sales Manager', 120000, 3),
  ('Data Entry Clerk', 45000, 5)

INSERT INTO employee (first_name, last_name, role_id)
VALUES
  ('Ronald', 'Firbank', 25),
  ('Virginia', 'Woolf', 26)
--   ('Piers', 'Gaveston', 27, 3),
--   ('Charles', 'LeRoi', 28, 2),
--   ('Katherine', 'Mansfield', 29, 2),
--   ('Dora', 'Carrington', 30, 4),
--   ('Edward', 'Bellamy', 31, 3),
--   ('Montague', 'Summers', 32, 5),
--   ('Octavia', 'Butler', 30, 4),
--   ('Unica', 'Zurn', 30, 4)
