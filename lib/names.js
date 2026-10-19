// Bancos de nomes por país, com nomes e sobrenomes comuns em cada região.

export const NAMES = {
  BR: {
    male: ['Miguel', 'Arthur', 'Gael', 'Heitor', 'Theo', 'Davi', 'Gabriel', 'Bernardo', 'Samuel', 'João', 'Pedro', 'Lucas', 'Rafael', 'Gustavo', 'Matheus', 'Felipe', 'Bruno', 'Thiago', 'Leonardo', 'Rodrigo', 'Eduardo', 'Carlos', 'Paulo', 'André', 'Marcelo', 'Ricardo', 'Fernando', 'Diego', 'Vinícius', 'Caio', 'Henrique', 'Otávio', 'Murilo', 'Enzo', 'Lorenzo', 'Benício', 'Antônio', 'Francisco', 'José', 'Luiz', 'Wellington', 'Anderson', 'Cleiton', 'Juliano'],
    female: ['Helena', 'Alice', 'Laura', 'Maria', 'Valentina', 'Heloísa', 'Manuela', 'Júlia', 'Sophia', 'Isabella', 'Cecília', 'Lívia', 'Beatriz', 'Mariana', 'Gabriela', 'Fernanda', 'Camila', 'Larissa', 'Amanda', 'Letícia', 'Juliana', 'Patrícia', 'Aline', 'Bruna', 'Carolina', 'Daniela', 'Renata', 'Vanessa', 'Tatiane', 'Luana', 'Clara', 'Lorena', 'Yasmin', 'Rafaela', 'Natália', 'Ana', 'Francisca', 'Antônia', 'Adriana', 'Simone', 'Jéssica', 'Thaís'],
    middleMale: ['Henrique', 'Eduardo', 'Augusto', 'Antônio', 'Paulo', 'Gabriel', 'Luiz', 'Carlos', 'Felipe', 'Vinícius'],
    middleFemale: ['Maria', 'Luiza', 'Eduarda', 'Fernanda', 'Vitória', 'Cristina', 'Aparecida', 'Clara', 'Beatriz', 'Carolina'],
    surnames: ['Silva', 'Santos', 'Oliveira', 'Souza', 'Rodrigues', 'Ferreira', 'Alves', 'Pereira', 'Lima', 'Gomes', 'Costa', 'Ribeiro', 'Martins', 'Carvalho', 'Almeida', 'Lopes', 'Soares', 'Fernandes', 'Vieira', 'Barbosa', 'Rocha', 'Dias', 'Nascimento', 'Andrade', 'Moreira', 'Nunes', 'Marques', 'Machado', 'Mendes', 'Freitas', 'Cardoso', 'Ramos', 'Gonçalves', 'Santana', 'Teixeira', 'Araújo', 'Correia', 'Pinto', 'Moura', 'Cavalcanti', 'Monteiro', 'Barros', 'Campos', 'Batista', 'Castro', 'Azevedo', 'Rezende', 'Siqueira', 'Pacheco', 'Nogueira'],
  },
  AR: {
    male: ['Santiago', 'Mateo', 'Bautista', 'Benjamín', 'Thiago', 'Felipe', 'Lautaro', 'Joaquín', 'Facundo', 'Agustín', 'Nicolás', 'Tomás', 'Franco', 'Ignacio', 'Gonzalo', 'Federico', 'Matías', 'Leandro', 'Maximiliano', 'Ezequiel', 'Juan Cruz', 'Lucas', 'Valentín', 'Martín', 'Diego', 'Pablo', 'Sebastián', 'Hernán', 'Marcelo', 'Gustavo', 'Emiliano', 'Nahuel'],
    female: ['Martina', 'Sofía', 'Catalina', 'Emma', 'Olivia', 'Mía', 'Delfina', 'Valentina', 'Florencia', 'Agustina', 'Camila', 'Micaela', 'Lucía', 'Julieta', 'Milagros', 'Rocío', 'Antonella', 'Carolina', 'Romina', 'Daniela', 'Luciana', 'Belén', 'Malena', 'Abril', 'Victoria', 'Josefina', 'Brenda', 'Celeste'],
    surnames: ['González', 'Rodríguez', 'Gómez', 'Fernández', 'López', 'Díaz', 'Martínez', 'Pérez', 'García', 'Sánchez', 'Romero', 'Sosa', 'Álvarez', 'Torres', 'Ruiz', 'Ramírez', 'Flores', 'Acosta', 'Benítez', 'Medina', 'Suárez', 'Herrera', 'Aguirre', 'Pereyra', 'Gutiérrez', 'Giménez', 'Molina', 'Rossi', 'Ferrari', 'Russo', 'Bianchi', 'Ferreyra', 'Ledesma', 'Quiroga', 'Carrizo', 'Peralta', 'Domínguez', 'Ponce'],
  },
  CL: {
    male: ['Benjamín', 'Vicente', 'Martín', 'Matías', 'Joaquín', 'Agustín', 'Tomás', 'Cristóbal', 'Maximiliano', 'Sebastián', 'Felipe', 'Diego', 'Ignacio', 'Nicolás', 'Francisco', 'Rodrigo', 'Gonzalo', 'Claudio', 'Patricio', 'Cristián', 'Mauricio', 'Álvaro', 'Pablo', 'Andrés', 'Jorge', 'Bastián', 'Alonso'],
    female: ['Sofía', 'Isidora', 'Florencia', 'Agustina', 'Emilia', 'Josefa', 'Trinidad', 'Antonella', 'Martina', 'Constanza', 'Catalina', 'Javiera', 'Francisca', 'Valentina', 'Fernanda', 'Camila', 'Daniela', 'Carolina', 'Paulina', 'Macarena', 'Pía', 'Carla', 'Bárbara', 'Maite'],
    surnames: ['González', 'Muñoz', 'Rojas', 'Díaz', 'Pérez', 'Soto', 'Contreras', 'Silva', 'Martínez', 'Sepúlveda', 'Morales', 'Rodríguez', 'López', 'Fuentes', 'Hernández', 'Torres', 'Araya', 'Flores', 'Espinoza', 'Valenzuela', 'Castillo', 'Tapia', 'Reyes', 'Gutiérrez', 'Castro', 'Pizarro', 'Álvarez', 'Vásquez', 'Sánchez', 'Fernández', 'Ramírez', 'Carrasco', 'Gómez', 'Cortés', 'Herrera', 'Núñez', 'Jara', 'Vergara', 'Rivera', 'Figueroa'],
  },
  CO: {
    male: ['Santiago', 'Samuel', 'Sebastián', 'Matías', 'Alejandro', 'Nicolás', 'Juan David', 'Juan Pablo', 'Juan Sebastián', 'Andrés Felipe', 'Carlos Andrés', 'Daniel', 'David', 'Jhon', 'Julián', 'Camilo', 'Esteban', 'Mauricio', 'Jaime', 'Hernán', 'Óscar', 'Wilson', 'Fabián', 'Diego', 'Jorge', 'Jhonatan', 'Luis Fernando'],
    female: ['Valentina', 'Mariana', 'Isabella', 'Sara', 'Salomé', 'Luciana', 'María José', 'María Camila', 'Laura', 'Daniela', 'Paula Andrea', 'Natalia', 'Diana', 'Carolina', 'Angélica', 'Juliana', 'Catalina', 'Lina', 'Yuliana', 'Marcela', 'Sandra', 'Claudia', 'Luz Marina', 'Gloria', 'Leidy'],
    surnames: ['Rodríguez', 'Gómez', 'González', 'Martínez', 'García', 'López', 'Hernández', 'Sánchez', 'Ramírez', 'Pérez', 'Díaz', 'Muñoz', 'Rojas', 'Moreno', 'Jiménez', 'Vargas', 'Castro', 'Gutiérrez', 'Ortiz', 'Álvarez', 'Ruiz', 'Suárez', 'Torres', 'Romero', 'Herrera', 'Valencia', 'Quintero', 'Restrepo', 'Ospina', 'Cardona', 'Osorio', 'Giraldo', 'Mejía', 'Arango', 'Zapata', 'Agudelo', 'Ramos', 'Cárdenas', 'Salazar', 'Villegas'],
  },
  PE: {
    male: ['Luis', 'José', 'Juan', 'Carlos', 'Jorge', 'Miguel', 'César', 'Víctor', 'Manuel', 'Jesús', 'Walter', 'Percy', 'Edwin', 'Elmer', 'Renzo', 'Piero', 'Gianfranco', 'Diego', 'Sebastián', 'Mateo', 'Santiago', 'Thiago', 'Rodrigo', 'Alonso', 'Raúl', 'Fernando', 'Christian'],
    female: ['María', 'Rosa', 'Carmen', 'Ana', 'Luz', 'Milagros', 'Yesenia', 'Lucía', 'Gabriela', 'Andrea', 'Fiorella', 'Kiara', 'Ximena', 'Valeria', 'Camila', 'Mariana', 'Flor', 'Elizabeth', 'Gladys', 'Patricia', 'Katherine', 'Diana', 'Rocío', 'Sandra', 'Mercedes'],
    surnames: ['Quispe', 'Flores', 'Sánchez', 'Rodríguez', 'García', 'Rojas', 'Mamani', 'Huamán', 'Ramos', 'Chávez', 'Díaz', 'Torres', 'Vásquez', 'Castillo', 'Mendoza', 'Ramírez', 'Espinoza', 'Fernández', 'Gutiérrez', 'Pérez', 'Vargas', 'López', 'Cruz', 'Gonzales', 'Condori', 'Ccahuana', 'Huanca', 'Paredes', 'Salazar', 'Cárdenas', 'Ríos', 'Chumpitaz', 'Villanueva', 'Tello', 'Zevallos'],
  },
  UY: {
    male: ['Mateo', 'Benjamín', 'Santiago', 'Joaquín', 'Bautista', 'Thiago', 'Felipe', 'Facundo', 'Agustín', 'Gonzalo', 'Federico', 'Rodrigo', 'Martín', 'Diego', 'Pablo', 'Sebastián', 'Nicolás', 'Juan Pablo', 'Marcelo', 'Andrés', 'Fernando', 'Gastón', 'Washington', 'Álvaro', 'Germán'],
    female: ['Emma', 'Isabella', 'Catalina', 'Martina', 'Sofía', 'Valentina', 'Agustina', 'Florencia', 'Camila', 'Lucía', 'Victoria', 'Josefina', 'Paula', 'Carolina', 'Andrea', 'Natalia', 'Fernanda', 'Mariana', 'Lorena', 'Silvana', 'Verónica', 'Rossana', 'Jimena'],
    surnames: ['Rodríguez', 'González', 'Martínez', 'García', 'Fernández', 'López', 'Pérez', 'Silva', 'Sosa', 'Pereira', 'Díaz', 'Gómez', 'Álvarez', 'Suárez', 'Hernández', 'Cabrera', 'Romero', 'Ramírez', 'Acosta', 'Núñez', 'Castro', 'Méndez', 'Olivera', 'Da Silva', 'Techera', 'Píriz', 'Cardozo', 'De León', 'Correa', 'Viera'],
  },
  PY: {
    male: ['Juan', 'José', 'Carlos', 'Luis', 'Miguel', 'Jorge', 'Rodrigo', 'Derlis', 'Osvaldo', 'Hugo', 'Ramón', 'Celso', 'Néstor', 'Arnaldo', 'Rubén', 'Fernando', 'Gustavo', 'Diego', 'Mateo', 'Santiago', 'Thiago', 'Lucas', 'Fabián', 'Óscar', 'Teodoro', 'Blas'],
    female: ['María', 'Liz', 'Ana', 'Rosa', 'Lourdes', 'Fátima', 'Mirtha', 'Gladys', 'Zunilda', 'Nidia', 'Lorena', 'Andrea', 'Fabiola', 'Romina', 'Paola', 'Gabriela', 'Natalia', 'Belén', 'Tamara', 'Fernanda', 'Sofía', 'Camila', 'Luján', 'Celeste', 'Graciela'],
    surnames: ['González', 'Benítez', 'Martínez', 'López', 'Giménez', 'Vera', 'Duarte', 'Ramírez', 'Villalba', 'Fernández', 'Acosta', 'Rojas', 'Báez', 'Gómez', 'Ortiz', 'Cáceres', 'Núñez', 'Cabrera', 'Ayala', 'Ríos', 'Romero', 'Franco', 'Espínola', 'Aquino', 'Insfrán', 'Recalde', 'Galeano', 'Ovelar', 'Ferreira', 'Sanabria', 'Riquelme', 'Cardozo'],
  },
  BO: {
    male: ['Juan', 'Luis', 'Carlos', 'José', 'Jorge', 'Mario', 'Freddy', 'Marco Antonio', 'Wilfredo', 'Grover', 'Edwin', 'Rolando', 'René', 'Álvaro', 'Gonzalo', 'Sergio', 'Daniel', 'Mauricio', 'Ronald', 'Fernando', 'Diego', 'Mateo', 'Santiago', 'Sebastián', 'Limbert'],
    female: ['María', 'Rosa', 'Ana', 'Patricia', 'Carmen', 'Juana', 'Lourdes', 'Gabriela', 'Daniela', 'Paola', 'Wendy', 'Jhenny', 'Mónica', 'Silvia', 'Ximena', 'Valeria', 'Camila', 'Andrea', 'Roxana', 'Lidia', 'Elizabeth', 'Rocío', 'Fernanda', 'Wara'],
    surnames: ['Mamani', 'Quispe', 'Choque', 'Condori', 'Flores', 'Vargas', 'Rojas', 'Gutiérrez', 'Fernández', 'López', 'Pérez', 'García', 'Rodríguez', 'Torrez', 'Cruz', 'Huanca', 'Ticona', 'Apaza', 'Limachi', 'Chambi', 'Coca', 'Gonzales', 'Vaca', 'Justiniano', 'Suárez', 'Paz', 'Arce', 'Villarroel', 'Salazar', 'Medina'],
  },
  EC: {
    male: ['José', 'Luis', 'Carlos', 'Juan', 'Jorge', 'Fernando', 'Xavier', 'Patricio', 'Fabián', 'Marco', 'Edison', 'Byron', 'Wilson', 'Holger', 'Galo', 'Andrés', 'Diego', 'Sebastián', 'Mateo', 'Santiago', 'Martín', 'Alejandro', 'Joel', 'Darío', 'Pablo'],
    female: ['María', 'Mónica', 'Verónica', 'Gabriela', 'Andrea', 'Karla', 'Jessica', 'Johanna', 'Paola', 'Mayra', 'Silvia', 'Lorena', 'Daniela', 'Valentina', 'Camila', 'Isabella', 'Doménica', 'Emilia', 'Ana', 'Carmen', 'Rosa', 'Gissela', 'Tatiana', 'Cristina'],
    surnames: ['Vera', 'Zambrano', 'Mendoza', 'Cedeño', 'Rodríguez', 'Sánchez', 'López', 'García', 'Torres', 'Morales', 'Chávez', 'Moreira', 'Macías', 'Pérez', 'Andrade', 'Suárez', 'Castillo', 'Vásquez', 'Ortiz', 'Jiménez', 'Reyes', 'Ruiz', 'Guerrero', 'Romero', 'Paredes', 'Bravo', 'Alvarado', 'Villacís', 'Salazar', 'Toapanta', 'Chicaiza', 'Yánez', 'Cevallos', 'Ponce'],
  },
  VE: {
    male: ['José', 'Luis', 'Carlos', 'Jesús', 'Juan', 'Pedro', 'Miguel', 'Rafael', 'Ángel', 'Francisco', 'Jorge', 'Antonio', 'Alejandro', 'Leonardo', 'Gustavo', 'Oswaldo', 'Freddy', 'Wilmer', 'Yonathan', 'Deivis', 'Jhonny', 'Santiago', 'Sebastián', 'Samuel', 'Diego'],
    female: ['María', 'Ana', 'Carmen', 'Rosa', 'Yolanda', 'Gabriela', 'Andreína', 'Mariángel', 'Yuleisy', 'Daniela', 'Valentina', 'Fabiola', 'Génesis', 'Oriana', 'Nathaly', 'Stefany', 'Yelitza', 'Marisol', 'Yusmary', 'Isabel', 'Victoria', 'Paola', 'Mariana', 'Carolina'],
    surnames: ['González', 'Rodríguez', 'Pérez', 'Hernández', 'García', 'Martínez', 'López', 'Díaz', 'Sánchez', 'Romero', 'Ramírez', 'Torres', 'Gómez', 'Rojas', 'Silva', 'Morales', 'Rivas', 'Mendoza', 'Contreras', 'Medina', 'Castillo', 'Marcano', 'Guerrero', 'Blanco', 'Briceño', 'Chacón', 'Zambrano', 'Salazar', 'Camacho', 'Aponte', 'Vargas', 'Ortega'],
  },
  GY: {
    male: ['Ravi', 'Rajesh', 'Anil', 'Vishnu', 'Kevin', 'Andrew', 'Michael', 'Shane', 'Troy', 'Leon', 'Dwayne', 'Marcus', 'Joel', 'Deon', 'Ryan', 'Nigel', 'Sanjay', 'Terrence', 'Brian', 'Devon', 'Rohan', 'Shiv'],
    female: ['Priya', 'Anita', 'Shalini', 'Sunita', 'Keisha', 'Tamika', 'Natasha', 'Michelle', 'Sharon', 'Alicia', 'Candace', 'Shanice', 'Reshma', 'Kavita', 'Melissa', 'Andrea', 'Simone', 'Jennifer', 'Latoya', 'Nadira', 'Savitri'],
    surnames: ['Persaud', 'Singh', 'Ramnarine', 'Mohamed', 'Khan', 'Ali', 'Narine', 'Williams', 'Thomas', 'Jones', 'Johnson', 'Phillips', 'Charles', 'Hamilton', 'Fraser', 'Barker', 'Jagdeo', 'Ramdass', 'Bacchus', 'DeFreitas', 'Sukhdeo', 'Gonsalves'],
  },
  SR: {
    male: ['Ricardo', 'Romano', 'Rishi', 'Ashwin', 'Sergio', 'Dennis', 'Marvin', 'Kenneth', 'Jairo', 'Clifton', 'Ravindre', 'Sunil', 'Gerold', 'Iwan', 'Stanley', 'Edgar', 'Henk', 'Delano', 'Wensley', 'Radjesh'],
    female: ['Shanti', 'Anjali', 'Sharmila', 'Nathalie', 'Jennifer', 'Ingrid', 'Jolanda', 'Marlies', 'Saskia', 'Chantal', 'Melissa', 'Priya', 'Rachel', 'Sandra', 'Gina', 'Wilma', 'Hilda', 'Romy', 'Kiran', 'Esther'],
    surnames: ['Ramdin', 'Sardjoe', 'Soekhoe', 'Pinas', 'Wijngaarde', 'Kartodikromo', 'Bouterse', 'Santokhi', 'Venetiaan', 'Brunswijk', 'Abdoel', 'Sewnarain', 'Pawirodikromo', 'Linger', 'Kromodimedjo', 'Pengel', 'Tjon', 'Lie', 'Jap', 'Van Dijk'],
  },
};
