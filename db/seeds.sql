INSERT INTO department (name)
VALUES
('Management'),
('Operations'),
('Marketing and Sales'),
('Research and Development'),
('Finance');

INSERT INTO roles (title, salary, department_id)
VALUES
  ('Administrative Assistant', 65000, 2),
  ('Executive Assistant', 77000, 2), 
  ('Marketing Manager', 170000, 3),
  ('Customer Service Rep', 59000, 3),
  ('IT', 150000, 4),
  ('Software Engineer', 125000, 4),
  ('Sales Manager', 120000, 3),
  ('Data Entry Clerk', 45000, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
  ('Ronald', 'Firbank', 1, 6),
  ('Virginia', 'Woolf', 2, 1),
  ('Piers', 'Gaveston', 3, 3),
  ('Charles', 'LeRoi', 4, 2),
  ('Katherine', 'Mansfield', 5, 2),
  ('Dora', 'Carrington', 1, 4),
  ('Edward', 'Bellamy', 2, 3),
  ('Montague', 'Summers', 3, 5),
  ('Octavia', 'Butler', 5, 4),
  ('Unica', 'Zurn', 5, 4);
