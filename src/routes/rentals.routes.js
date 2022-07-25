import { Router } from 'express';

import rentalController from '../controllers/rental.controller.js';

const rentalRoutes = Router();

rentalRoutes.get('/rentals', rentalController.index);
rentalRoutes.post('/rentals', rentalController.create);
rentalRoutes.post('/rentals/:id/return', rentalController.returnRental);
rentalRoutes.delete('/rentals/:id', rentalController.remove);

export default rentalRoutes;
