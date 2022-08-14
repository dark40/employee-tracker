INSERT INTO department(id, name)
VALUES  (1, "Finance"),
        (2, "IT"),
        (3, "Legal"),
        (4, "People"),
        (5, "Admin");

INSERT INTO role(id, title, salary, department_id)
VALUES  (1, "Engineer", 80000 , 2),
        (2, "Accountant", 70000 , 1),
        (3, "Lawyer", 60000, 3),
        (4, "HR", 50000, 4),
        (5, "Assistant", 40000, 5);

INSERT INTO employee(id, first_name, last_name, role_id, manager_id)
VALUES  (1, "Peter", "Smith", 1, NULL),
        (2, "Liam", "Johnson", 2, NULL),
        (3, "Noah", "Williams", 3, NULL),
        (4, "Oliver", "Brown", 4, 1),
        (5, "Olivia", "Jones", 5, NULL),
        (6, "Emma", "Garcia", 1, NULL),
        (7, "Charlotte", "Miller", 2, 3),
        (8, "Amelia", "Davis", 3, 7),
        (9, "James", "Rodriguez", 4, NULL),
        (10, "Benjamin", "Martinez", 5, NULL);