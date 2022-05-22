INSERT INTO department (name)
VALUES
    ('Marketing'),
    ('Finance'),
    ('Operations'),
    ('Human Resource'),
    ('IT');

INSERT INTO roles (title, salary, department_id)
VALUES
    ('Marketing Manager', 95000, 1),
    ('Marketing Specialist', 60000, 1),
    ('Finacial Manager', 120000, 2),
    ('Finacial Advisor', 65000, 2), 
    ('Business Manager', 114000, 3), 
    ('Business Analyst', 34000, 3),
    ('HR Manager', 87500, 4),
    ('Entry-Level HR', 30000, 4),
    ('IT Manager', 75000, 5),
    ('IT Technician', 43500, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ('Yuri', 'Nator', 1, NULL),
    ('Harry', 'Johnson', 2, 1),
    ('Amanda', 'Hump', 2, 1),
    ('Stella', 'Virgin', 3, NULL),
    ('Max E.', 'Pad', 4, 4),
    ('Ura', 'Snotball', 4, 4),
    ('Cole', 'Ostamie', 5, NULL),
    ('Ivana', 'Tinkle', 6, 7),
    ('Lee', 'Nover', 6, 7),
    ('Kareem', 'O-Weet', 7, NULL),
    ('Poppa', 'Woody', 8, 10),
    ('Ron', 'Chee', 8, 10),
    ('Wan', 'Curr', 9, NULL),
    ('Artie', 'Incell', 10, 13),
    ('Sarah', 'Poon', 10, 13);