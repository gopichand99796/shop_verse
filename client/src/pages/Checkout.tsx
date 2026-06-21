import { useState } from 'react';
import { orders, cart } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Truck, MapPin, CreditCard, Lock, ArrowRight, ChevronRight } from 'lucide-react';
import { formatPrice } from '../lib/utils';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';

type CheckoutStep = 'shipping' | 'payment' | 'review' | 'confirmation';

export default function Checkout() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('shipping');
  const [isProcessing, setIsProcessing] = useState(false);

  // Shipping form state
  const [shippingData, setShippingData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'USA'
  });

  // Payment form state
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });

  const steps = [
    { id: 'shipping', title: 'Shipping', icon: MapPin },
    { id: 'payment', title: 'Payment', icon: CreditCard },
    { id: 'review', title: 'Review', icon: Check }
  ];

  const currentStepIndex = steps.findIndex(step => step.id === currentStep);

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep('payment');
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep('review');
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    try {
      await orders.create({ shippingAddress: JSON.stringify(shippingData) });
      setCurrentStep('confirmation');
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const subtotal = 150; // This would come from cart
  const shipping = subtotal > 50 ? 0 : 5.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const renderStep = () => {
    switch (currentStep) {
      case 'shipping':
        return (
          <form onSubmit={handleShippingSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Input
                label="Full Name"
                value={shippingData.fullName}
                onChange={(e) => setShippingData({ ...shippingData, fullName: e.target.value })}
                placeholder="John Doe"
                required
              />
              <Input
                label="Email"
                type="email"
                value={shippingData.email}
                onChange={(e) => setShippingData({ ...shippingData, email: e.target.value })}
                placeholder="john@example.com"
                required
              />
            </div>
            <Input
              label="Phone"
              type="tel"
              value={shippingData.phone}
              onChange={(e) => setShippingData({ ...shippingData, phone: e.target.value })}
              placeholder="+1 (555) 123-4567"
              required
            />
            <Input
              label="Street Address"
              value={shippingData.address}
              onChange={(e) => setShippingData({ ...shippingData, address: e.target.value })}
              placeholder="123 Commerce Street"
              required
            />
            <div className="grid md:grid-cols-3 gap-6">
              <Input
                label="City"
                value={shippingData.city}
                onChange={(e) => setShippingData({ ...shippingData, city: e.target.value })}
                placeholder="New York"
                required
              />
              <Input
                label="State"
                value={shippingData.state}
                onChange={(e) => setShippingData({ ...shippingData, state: e.target.value })}
                placeholder="NY"
                required
              />
              <Input
                label="Postal Code"
                value={shippingData.postalCode}
                onChange={(e) => setShippingData({ ...shippingData, postalCode: e.target.value })}
                placeholder="10001"
                required
              />
            </div>
            <Button type="submit" size="lg" className="w-full">
              Continue to Payment <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </form>
        );

      case 'payment':
        return (
          <form onSubmit={handlePaymentSubmit} className="space-y-6">
            <div className="bg-neutral-50 p-4 rounded-xl mb-6">
              <div className="flex items-center gap-2 text-sm text-neutral-600">
                <Lock className="h-4 w-4" />
                <span>Your payment information is secure and encrypted</span>
              </div>
            </div>
            <Input
              label="Card Number"
              value={paymentData.cardNumber}
              onChange={(e) => setPaymentData({ ...paymentData, cardNumber: e.target.value })}
              placeholder="1234 5678 9012 3456"
              required
            />
            <Input
              label="Cardholder Name"
              value={paymentData.cardName}
              onChange={(e) => setPaymentData({ ...paymentData, cardName: e.target.value })}
              placeholder="John Doe"
              required
            />
            <div className="grid md:grid-cols-2 gap-6">
              <Input
                label="Expiry Date"
                value={paymentData.expiryDate}
                onChange={(e) => setPaymentData({ ...paymentData, expiryDate: e.target.value })}
                placeholder="MM/YY"
                required
              />
              <Input
                label="CVV"
                value={paymentData.cvv}
                onChange={(e) => setPaymentData({ ...paymentData, cvv: e.target.value })}
                placeholder="123"
                required
              />
            </div>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => setCurrentStep('shipping')}
                className="flex-1"
              >
                Back
              </Button>
              <Button type="submit" size="lg" className="flex-1">
                Review Order <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </form>
        );

      case 'review':
        return (
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Shipping Address</h3>
              <div className="text-neutral-600">
                <p>{shippingData.fullName}</p>
                <p>{shippingData.address}</p>
                <p>{shippingData.city}, {shippingData.state} {shippingData.postalCode}</p>
                <p>{shippingData.country}</p>
                <p className="mt-2">{shippingData.email}</p>
                <p>{shippingData.phone}</p>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-4">Payment Method</h3>
              <div className="text-neutral-600">
                <p>•••• •••• •••• {paymentData.cardNumber.slice(-4)}</p>
                <p>{paymentData.cardName}</p>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-4">Order Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-neutral-600">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Tax</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                <div className="border-t border-neutral-200 pt-3 flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
            </Card>

            <div className="flex gap-3">
              <Button
                variant="outline"
                size="lg"
                onClick={() => setCurrentStep('payment')}
                className="flex-1"
              >
                Back
              </Button>
              <Button
                size="lg"
                onClick={handlePlaceOrder}
                isLoading={isProcessing}
                className="flex-1"
              >
                Place Order <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        );

      case 'confirmation':
        return (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-3xl font-display font-bold text-neutral-900 mb-4">
              Order Placed Successfully!
            </h2>
            <p className="text-lg text-neutral-600 mb-8">
              Thank you for your purchase. Your order has been received and is being processed.
            </p>
            <div className="flex gap-3 justify-center">
              <Button
                variant="outline"
                onClick={() => navigate('/orders')}
              >
                View Orders
              </Button>
              <Button onClick={() => navigate('/products')}>
                Continue Shopping
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl md:text-4xl font-display font-bold text-neutral-900 mb-8">
          Checkout
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Progress Steps */}
            {currentStep !== 'confirmation' && (
              <div className="mb-8">
                <div className="flex items-center justify-between">
                  {steps.map((step, index) => {
                    const StepIcon = step.icon;
                    const isCompleted = index < currentStepIndex;
                    const isCurrent = index === currentStepIndex;
                    return (
                      <div key={step.id} className="flex items-center flex-1">
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                              isCompleted
                                ? 'bg-primary-600 text-white'
                                : isCurrent
                                ? 'bg-primary-600 text-white'
                                : 'bg-neutral-200 text-neutral-400'
                            }`}
                          >
                            {isCompleted ? <Check className="h-6 w-6" /> : <StepIcon className="h-6 w-6" />}
                          </div>
                          <span className={`text-sm mt-2 ${isCurrent ? 'font-semibold text-primary-600' : 'text-neutral-500'}`}>
                            {step.title}
                          </span>
                        </div>
                        {index < steps.length - 1 && (
                          <div
                            className={`flex-1 h-1 mx-4 ${isCompleted ? 'bg-primary-600' : 'bg-neutral-200'}`}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <Card className="p-6 md:p-8">
              {renderStep()}
            </Card>
          </div>

          {/* Order Summary Sidebar */}
          {currentStep !== 'confirmation' && (
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-24">
                <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-neutral-600">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-neutral-600">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
                  </div>
                  <div className="flex justify-between text-neutral-600">
                    <span>Tax (8%)</span>
                    <span>{formatPrice(tax)}</span>
                  </div>
                  <div className="border-t border-neutral-200 pt-4 flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>

                <div className="bg-primary-50 p-4 rounded-xl">
                  <div className="flex items-start gap-3">
                    <Truck className="h-5 w-5 text-primary-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-primary-900">Free Shipping</p>
                      <p className="text-sm text-primary-700">Orders over $50 qualify for free shipping</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
