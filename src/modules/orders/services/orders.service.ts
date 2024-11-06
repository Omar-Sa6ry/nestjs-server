import { Injectable } from '@nestjs/common'
import Stripe from 'stripe'
import { OrderDataDto } from '../dtos/OrderData.dto'
const stripe = new Stripe(
  'sk_test_51QH5o3ANtko4faugIquk8iq71WNOx35Fg9PpZ1ztrOTv8vOJiCib07FLHl54xA7Ccb7DsuPVfaebq9waENTKzKCW00uWMaa0zg',
)

@Injectable()
export class OrdersService {
  async createStripe (orderData: OrderDataDto) {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'egp',
            unit_amount: Math.round(orderData.price * 100),
            product_data: {
              name: 'nestjs',
              description: orderData.description,
              images: [orderData.logo],
            },
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: orderData.success_url,
      cancel_url: orderData.cancel_url,
      client_reference_id: orderData.userId,
      customer_email: orderData.email,
    })

    return session.url
  }
}
