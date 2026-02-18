
import { 
  Category, 
  Product, 
  Warehouse, 
  Customer, 
  Role, 
  PaymentMethod,
  Sale,
  InventoryItem
} from './types';

const generateMargin = (cost: number) => Math.round(cost * 1.15);

export const INITIAL_PRODUCTS: Product[] = [
  // HIELO INDUSTRIAL
  { id: 'p1', name: 'Tarima Hielo Cúbico (100 bolsas)', category: Category.HIELO, acquisitionCost: 1800, salePrice: generateMargin(1800) },
  { id: 'p2', name: 'Tonelada Hielo en Escama', category: Category.HIELO, acquisitionCost: 1200, salePrice: generateMargin(1200) },
  { id: 'p3', name: 'Costal Hielo Frappé 20kg (Pack 50)', category: Category.HIELO, acquisitionCost: 2500, salePrice: generateMargin(2500) },
  
  // CERVEZA POR VOLUMEN
  { id: 'p4', name: 'Pallet Corona Extra 355ml (80 cajas)', category: Category.CERVEZA, acquisitionCost: 28000, salePrice: generateMargin(28000) },
  { id: 'p5', name: 'Pallet Victoria 1.2L (50 cajas)', category: Category.CERVEZA, acquisitionCost: 19500, salePrice: generateMargin(19500) },
  { id: 'p6', name: 'Lote Modelo Especial Lata (100 charolas)', category: Category.CERVEZA, acquisitionCost: 45000, salePrice: generateMargin(45000) },
  
  // LICORES PREMIUM (CAJAS)
  { id: 'p7', name: 'Caja Maestro Dobel (12 botellas)', category: Category.LICOR, acquisitionCost: 7200, salePrice: generateMargin(7200) },
  { id: 'p8', name: 'Caja Don Julio 70 (12 botellas)', category: Category.LICOR, acquisitionCost: 10800, salePrice: generateMargin(10800) },
  { id: 'p9', name: 'Caja J. Walker Black (12 botellas)', category: Category.LICOR, acquisitionCost: 9600, salePrice: generateMargin(9600) },
  { id: 'p10', name: 'Caja Mezcal 400 Conejos (12 botellas)', category: Category.LICOR, acquisitionCost: 5400, salePrice: generateMargin(5400) },
  
  // MEZCLADORES (PALLETS)
  { id: 'p11', name: 'Pallet Coca Cola 600ml (60 cajas)', category: Category.REFRESCO, acquisitionCost: 18000, salePrice: generateMargin(18000) },
  { id: 'p12', name: 'Pallet Mineral Topo Chico (50 cajas)', category: Category.REFRESCO, acquisitionCost: 16500, salePrice: generateMargin(16500) }
];

export const INITIAL_WAREHOUSES: Warehouse[] = [
  { id: 'w1', name: 'CEDIS Matriz Villahermosa', location: 'Centro' },
  { id: 'w2', name: 'Bodega Operativa Feria', location: 'Naves Feria' },
  { id: 'w3', name: 'Unidad de Reparto 01', location: 'Zona Móvil' },
];

const RAW_CUSTOMERS = [
  {id: '1', zone: 'Teatro al A. L.', trade: 'MICHES Free Zon', line: 'Bebidas con licor', email: 'graniel8009@gmail.com', phone: '9931784650', manager: 'GASTON GRANIEL'},
  {id: '2', zone: 'Teatro al A. L.', trade: 'WOONKIE SUC 27 DE FEBRERO', line: 'Restaurantes', email: 'auxiliarcontablewoonkie@gmail.com', phone: '9934309782', manager: 'DARWIN HERNANDEZ VELAZQUEZ'},
  {id: '3', zone: 'Teatro al A. L.', trade: 'El Turuleto', line: 'Restaurantes', email: 'elturuleto@hotmail.com', phone: '9932597025', manager: 'Mariano Fernando Muñoz Graniel'},
  {id: '4', zone: 'Teatro al A. L.', trade: 'TAQUERÍA DEL NORTE', line: 'Restaurantes', email: 'hectormerinoflores@gmail.com', phone: '2223433971', manager: 'Hector eduardo Merino Flores'},
  {id: '5', zone: 'Teatro al A. L.', trade: 'Las miches', line: 'Bebidas preparadas y refrescos', email: 'magozonegym1@gmail.com', phone: '9932198700', manager: 'Margarita Mateos perez'},
  {id: '6', zone: 'Teatro al A. L.', trade: 'MICHEROCK', line: 'Bebidas con licor', email: 'd.chavela@hotmail.com', phone: '9931999043', manager: 'Daniel Sánchez Chavela'},
  {id: '7', zone: 'Teatro al A. L.', trade: 'Bambooh', line: 'Restaurantes', email: 'montejopago@gmail.com', phone: '9933205622', manager: 'Erik del Carmen Montejo Gonzalez'},
  {id: '8', zone: 'Teatro al A. L.', trade: 'micheladas', line: 'Restaurantes', email: 'pouleth_1923@hotmail.com', phone: '9991984909', manager: 'itzin pouleth jimenez gamboa'},
  {id: '9', zone: 'Teatro al A. L.', trade: 'LA RUCA', line: 'Restaurantes', email: 'kris.rubi.rc@gmail.com', phone: '9931793227', manager: 'Rubí lupita Cabrera sandoval'},
  {id: '10', zone: 'Zona A', trade: 'HERMANO LOBO', line: 'Bebidas preparadas y refrescos', email: 'miguelcamarena72@gmail.com', phone: '5951085132', manager: 'Wenceslao Miguel Camarena Ortiz'},
  {id: '11', zone: 'Zona B', trade: 'Cantaritos la güera', line: 'Restaurantes', email: 'soberanoperez26@gmail.com', phone: '9618082672', manager: 'Samuel Soberano perez'},
  {id: '12', zone: 'Zona B', trade: 'JAAC Litros', line: 'Bebidas con licor', email: 'chabelita030996@gmail.com', phone: '9361061159', manager: 'Maria Isabel Hernández Ruiz'},
  {id: '13', zone: 'Zona B', trade: 'Micheladas Arigato', line: 'Bebidas con licor', email: 'micharigato15@gmail.com', phone: '9141396026', manager: 'Ángel Adán Santos Mirabal'},
  {id: '14', zone: 'Zona B', trade: 'BARBANEGRA DRINKS', line: 'Bebidas con licor', email: 'gilaguilarmanuelraymundo@gmail.com', phone: '9371208672', manager: 'Manuel Raymundo Gil Aguilar'},
  {id: '15', zone: 'Zona B', trade: 'LAS MICHES', line: 'Bebidas preparadas y refrescos', email: 'zonegym1@hotmail.com', phone: '9934435318', manager: 'Víctor Hugo Ramirez Castillo'},
  {id: '16', zone: 'Zona B', trade: 'MicheRock', line: 'Bebidas con licor', email: 'ahuja10@hotmail.com', phone: '9932185575', manager: 'DAVID ANTONIO PEREZ AHUJA GUTIERREZ'},
  {id: '17', zone: 'Zona B', trade: 'MICHELADAS MENDEZ', line: 'Bebidas con licor', email: 'aronrojo76@gmail.com', phone: '9933441405', manager: 'AARON LOPEZ'},
  {id: '18', zone: 'Zona B', trade: 'LA TEQUILANA', line: 'Bebidas con licor', email: 'lizrs_18@hotmail.com', phone: '3323435796', manager: 'Lizbeth Raul Sanchez'},
  {id: '19', zone: 'Zona B', trade: 'Memelas Miches', line: 'Bebidas con licor', email: 'jcboliocordova@hotmail.com', phone: '9931377931', manager: 'Sergio augusto Bocanegra Guzmán'},
  {id: '20', zone: 'Zona B', trade: 'Las Casa de las Miches', line: 'Bebidas con licor', email: 'Raulolan8024@gmail.com', phone: '9931064991', manager: 'Raúl Olán León'},
  {id: '21', zone: 'Zona B', trade: 'LA 26 SEAFOOD BOUTIQUE', line: 'Restaurantes', email: 'marketrealplacevsa@gmail.com', phone: '9331321178', manager: 'JEIMY CAROLINA MATHISON JIMENEZ'},
  {id: '22', zone: 'Zona B', trade: 'TACOS GOYO', line: 'Bebidas con licor', email: 'gregory.caztellanos@gmail.com', phone: '9933603668', manager: 'Gregory Gutierrez Castellanos'},
  {id: '23', zone: 'Zona B', trade: 'Don Micheladas', line: 'Bebidas con licor', email: 'gregory.caztellanos@gmail.com', phone: '9933603668', manager: 'Gregory Gutierrez Castellanos'},
  {id: '24', zone: 'Zona B', trade: 'Son de a litro', line: 'Bebidas con licor', email: 'hector.abreu12@outlook.com', phone: '9933937169', manager: 'Hector Armando Abreu Dominguez'},
  {id: '25', zone: 'Zona B', trade: 'GORMANDA', line: 'Bares', email: 'maritzapalamas@gmail.com', phone: '9933836019', manager: 'MARITZA PALOMERAS LAMAS'},
  {id: '26', zone: 'Zona B', trade: 'TOKIO LA BANQUETA', line: 'Restaurantes', email: 'karenamorales11@gmail.com', phone: '9932780132', manager: 'Karen Araceli Morales Lopez'},
  {id: '27', zone: 'Zona B', trade: 'BLUE NIGHT', line: 'Bebidas con licor', email: 'mantenimiento_olan@outlook.com', phone: '9932380067', manager: 'Eduardo cornelio olan'},
  {id: '28', zone: 'Zona B', trade: 'MICHELADAS Y COKTELES (el flaco)', line: 'Bebidas con licor', email: 'karizabgu80@gmail.com', phone: '9931271646', manager: 'Rosa Karina Zabala Gutiérrez'},
  {id: '29', zone: 'Zona B', trade: 'Vasos Michelados VIKINGS', line: 'Bebidas con licor', email: 'karlasoloriog@hotmail.com', phone: '9933768015', manager: 'Karla Yazmin Solorio Garcia'},
  {id: '30', zone: 'Zona B', trade: 'Perro Negro', line: 'Bebidas con licor', email: 'antoniopriegopet@gmail.com', phone: '9931177288', manager: 'José antonio Priego Fernández'},
  {id: '31', zone: 'Zona B', trade: 'MAREA ALTA', line: 'Bares', email: 'mperez9306@gmail.com', phone: '9933997447', manager: 'Melissa Marina Pérez de la Cruz'},
  {id: '32', zone: 'Zona B', trade: 'TRAGO', line: 'Bares', email: 'contacto@tragotragotrago.com', phone: '9933940947', manager: 'Luis Carlos Dupeyron Estrada'},
  {id: '33', zone: 'Zona B', trade: 'Drinks la 57', line: 'Bebidas con licor', email: 'ferrojas0208@hotmail.com', phone: '9933823689', manager: 'Juan Enrique Rojas Pérez'},
  {id: '34', zone: 'Zona B', trade: 'CIN CIN & GLU GLU', line: 'Bares', email: 'kmca27@hotmail.com', phone: '9335933863', manager: 'Carolina monserrat Cornelio aguilar'},
  {id: '35', zone: 'Zona B', trade: 'MICHELADAS EL CHELO', line: 'Bebidas con licor', email: 'manuelfranciscoguzmandamas@gmail.com', phone: '9931539349', manager: 'Manuel Francisco Guzmán Damas'},
  {id: '36', zone: 'Zona B', trade: 'BLUE NIGHT SUC 2', line: 'Bebidas con licor', email: 'mantenimiento_olan2@outlook.com', phone: '9932380068', manager: 'Eduardo cornelio olan'},
  {id: '37', zone: 'Zona B', trade: 'LA BROCHETA CHOCA', line: 'Restaurantes', email: 'gabygarciatosca@gmail.com', phone: '9371427260', manager: 'Gabriela Garcia Garcia Tosca'},
  {id: '38', zone: 'Zona C', trade: 'Micheladas EL SaBOOOR!', line: 'Bebidas con licor', email: 'misaelga39@gmail.com', phone: '5611183243', manager: 'Misael González Antonio'},
  {id: '39', zone: 'Zona C', trade: 'La Micheleria de barrio', line: 'Bares', email: 'fredom_90@hotmail.com', phone: '9932156951', manager: 'Tania libertad Ortiz García'},
  {id: '40', zone: 'Zona C', trade: 'A la mala', line: 'Bebidas con licor', email: 'elcharitojimenez@gmail.com', phone: '9211443734', manager: 'Maria Guadalupe Aparicio García'},
  {id: '41', zone: 'Zona C', trade: "Benito's", line: 'Bares', email: 'eliasocanabal@gmail.com', phone: '9933488243', manager: 'Elias Ocaña Canabal'},
  {id: '42', zone: 'Zona C', trade: 'TOROS BAR', line: 'Bares', email: 'jonhymatias14@icloud.com', phone: '9932280432', manager: 'JONATHAN DAVID JESUS MATIAS'},
  {id: '43', zone: 'Zona C', trade: 'MICHELADAS EL FLACO SUC 2', line: 'Bebidas con licor', email: 'karizabgu80_2@gmail.com', phone: '9931271647', manager: 'Rosa Karina Zabala Gutiérrez'},
  {id: '44', zone: 'Zona C', trade: 'BARBANEGRA DRINKS SUC 2', line: 'Bebidas con licor', email: 'rafael071193@hotmail.com', phone: '9371417607', manager: 'Rafael Andre Gil Gaspar'},
  {id: '45', zone: 'Zona C', trade: 'Michelitros', line: 'Bebidas con licor', email: 'flastraz@hotmail.com', phone: '9931174611', manager: 'Flavio alberto Lastra Zurita'},
  {id: '46', zone: 'Zona C', trade: 'Micheloa', line: 'Bebidas con licor', email: 'sheylavelez99@gmail.com', phone: '9933724601', manager: 'Eliza Dahiana Peraza Gonzalez'},
  {id: '47', zone: 'Zona C', trade: 'Miches Doña Esa', line: 'Bebidas con licor', email: 'sandyferrer3@gmail.com', phone: '9381038004', manager: 'Sandra del rubi Ferrer García'},
  {id: '48', zone: 'Zona D', trade: 'SUMMER & DRINKS', line: 'Bebidas con licor', email: 'hanniag1@outlook.com', phone: '9994247641', manager: 'Hannia Alejandra García Lopez'},
  {id: '49', zone: 'Zona C', trade: 'Mex-Cladito', line: 'Bebidas con licor', email: 'karlaguzman3@hotmail.com', phone: '9931820370', manager: 'Karla Manuela López Guzmán'},
  {id: '50', zone: 'Zona D', trade: 'Delux', line: 'Bares', email: 'lorenact123441@gmail.com', phone: '9934187963', manager: 'Lorena Curiel'},
  {id: '51', zone: 'Zona D', trade: 'las miches del 69', line: 'Bebidas preparadas y refrescos', email: 'rrgr060393@gmail.com', phone: '9932833835', manager: 'Raul Ricardo Garcia Rincon'},
  {id: '52', zone: 'Zona D', trade: 'micheladas SUC 2', line: 'Restaurantes', email: 'pouleth_1923_2@hotmail.com', phone: '9991984910', manager: 'itzin pouleth jimenez gamboa'},
  {id: '53', zone: 'Zona C', trade: 'MICHELADAS LA 180', line: 'Bebidas con licor', email: 'solucionesg@hotmail.com', phone: '9931779021', manager: 'JOSE GUADALUPE GARCIA PAYRO'},
  {id: '54', zone: 'Zona C', trade: 'Silver Club', line: 'Bares', email: 'stormu146@gmail.com', phone: '9931107679', manager: 'salvador Toraya'},
];

export const INITIAL_CUSTOMERS: Customer[] = RAW_CUSTOMERS.map(c => ({
  id: `c${c.id}`,
  name: c.trade,
  zone: c.zone,
  balance: Math.random() > 0.7 ? Math.floor(Math.random() * 80000) : 0,
  tradeName: c.trade,
  businessLine: c.line,
  email: c.email,
  phone: c.phone,
  manager: c.manager
}));

const getRelativeDate = (daysAgo: number) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString();
};

// SIMULACIÓN DE VENTAS DE ALTO IMPACTO (Ticket Promedio 50k - 200k)
export const BASE_SALES: Sale[] = [
  // Ventas de hoy
  { id: 's1', date: getRelativeDate(0), customerId: 'c10', warehouseId: 'w2', items: [{ productId: 'p6', quantity: 2, price: 51750 }], total: 103500, paymentMethod: PaymentMethod.CONTADO, operatorId: 'op1' },
  { id: 's2', date: getRelativeDate(0), customerId: 'c25', warehouseId: 'w2', items: [{ productId: 'p4', quantity: 3, price: 32200 }], total: 96600, paymentMethod: PaymentMethod.CONSIGNACION, operatorId: 'op1' },
  { id: 's3', date: getRelativeDate(0), customerId: 'c50', warehouseId: 'w2', items: [{ productId: 'p8', quantity: 5, price: 12420 }], total: 62100, paymentMethod: PaymentMethod.CONTADO, operatorId: 'op1' },
  
  // Ventas ayer
  { id: 's4', date: getRelativeDate(1), customerId: 'c7', warehouseId: 'w2', items: [{ productId: 'p5', quantity: 4, price: 22425 }], total: 89700, paymentMethod: PaymentMethod.CONTADO, operatorId: 'op1' },
  { id: 's5', date: getRelativeDate(1), customerId: 'c32', warehouseId: 'w2', items: [{ productId: 'p6', quantity: 3, price: 51750 }], total: 155250, paymentMethod: PaymentMethod.CONSIGNACION, operatorId: 'op1' },
  { id: 's6', date: getRelativeDate(1), customerId: 'c18', warehouseId: 'w2', items: [{ productId: 'p9', quantity: 8, price: 11040 }], total: 88320, paymentMethod: PaymentMethod.CONTADO, operatorId: 'op1' },

  // Histórico para sumar a la meta de 12M
  ...Array.from({length: 40}).map((_, i) => ({
    id: `sh-${i}`,
    date: getRelativeDate(Math.floor(Math.random() * 5)),
    customerId: `c${Math.floor(Math.random() * 54) + 1}`,
    warehouseId: 'w2',
    items: [{ productId: 'p6', quantity: 2, price: 51750 }],
    total: Math.floor(Math.random() * 150000) + 45000,
    paymentMethod: PaymentMethod.CONTADO,
    operatorId: 'op1'
  }))
];

export const INITIAL_INVENTORY: InventoryItem[] = INITIAL_PRODUCTS.flatMap(p => 
  INITIAL_WAREHOUSES.map(w => ({
    productId: p.id,
    warehouseId: w.id,
    quantity: 1000 
  }))
);
