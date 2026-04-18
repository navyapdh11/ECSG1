'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { MapPin, Mail, Phone, User, MessageSquare, Check } from 'lucide-react';
import { useBookingStore } from '@/store/bookingStore';

const detailsSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^\+?[\d\s()-]{10,}$/, 'Invalid phone number'),
  street: z.string().min(5, 'Street address must be at least 5 characters'),
  city: z.string().min(2, 'City must be at least 2 characters'),
  state: z.string().min(2, 'State must be at least 2 characters'),
  zipCode: z.string().min(5, 'ZIP code must be at least 5 characters'),
  specialInstructions: z.string().optional(),
});

type DetailsForm = z.infer<typeof detailsSchema>;

interface BookingDetailsProps {
  onFormValid: (submitFn: () => boolean) => void;
}

export function BookingDetails({ onFormValid }: BookingDetailsProps) {
  const { address, setAddress, setSpecialInstructions } = useBookingStore();
  const [validFields, setValidFields] = useState<Set<string>>(new Set());

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<DetailsForm>({
    resolver: zodResolver(detailsSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      street: address.street || '',
      city: address.city || '',
      state: address.state || '',
      zipCode: address.zipCode || '',
      specialInstructions: '',
    },
  });

  // Track valid fields for inline validation - #10
  const watchedFields = watch();
  useEffect(() => {
    const newValid = new Set<string>();
    const fieldNames: (keyof DetailsForm)[] = ['name', 'email', 'phone', 'street', 'city', 'state', 'zipCode'];
    fieldNames.forEach((field) => {
      const value = watchedFields[field];
      if (value && !errors[field]) {
        newValid.add(field);
      }
    });
    setValidFields(newValid);
  }, [watchedFields, errors]);

  // Register form submit handler with parent
  useEffect(() => {
    const submitFn = () => {
      let valid = true;
      handleSubmit(
        (data) => {
          setAddress({
            street: data.street,
            city: data.city,
            state: data.state,
            zipCode: data.zipCode,
            country: 'US',
            email: data.email,
            name: data.name,
            phone: data.phone,
          });
          setSpecialInstructions(data.specialInstructions || '');
        },
        () => {
          valid = false;
        }
      )();
      return valid;
    };
    onFormValid(submitFn);
  }, [handleSubmit, setAddress, setSpecialInstructions, onFormValid]);

  const onSubmit = (data: DetailsForm) => {
    setAddress({
      street: data.street,
      city: data.city,
      state: data.state,
      zipCode: data.zipCode,
      country: 'US',
      email: data.email,
      name: data.name,
      phone: data.phone,
    });
    setSpecialInstructions(data.specialInstructions || '');
  };

  // Progress tracking - #10
  const requiredFields = ['name', 'email', 'phone', 'street', 'city', 'state', 'zipCode'];
  const completedCount = requiredFields.filter((f) => validFields.has(f)).length;
  const progressPercent = (completedCount / requiredFields.length) * 100;

  const inputFields: Array<{
    label: string;
    name: keyof DetailsForm;
    icon: typeof User;
    type: string;
    placeholder: string;
    errorId?: string;
  }> = [
    { label: 'Full Name', name: 'name', icon: User, type: 'text', placeholder: 'John Doe', errorId: 'name-error' },
    { label: 'Email Address', name: 'email', icon: Mail, type: 'email', placeholder: 'john@example.com', errorId: 'email-error' },
    { label: 'Phone Number', name: 'phone', icon: Phone, type: 'tel', placeholder: '+1 (555) 123-4567', errorId: 'phone-error' },
    { label: 'Street Address', name: 'street', icon: MapPin, type: 'text', placeholder: '123 Main St', errorId: 'street-error' },
    { label: 'City', name: 'city', icon: MapPin, type: 'text', placeholder: 'Sydney', errorId: 'city-error' },
    { label: 'State', name: 'state', icon: MapPin, type: 'text', placeholder: 'NSW', errorId: 'state-error' },
    { label: 'Postcode', name: 'zipCode', icon: MapPin, type: 'text', placeholder: '2000', errorId: 'zipCode-error' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Details</h2>
        <p className="text-gray-600">Please provide your contact information and address</p>
        
        {/* Progress bar - #10 */}
        <div className="mt-3">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span>{completedCount} of {requiredFields.length} fields complete</span>
            <span>{Math.round(progressPercent)}%</span>
          </div>
          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-success-500 to-primary-500"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {inputFields.map((field) => {
            const Icon = field.icon;
            const hasError = !!errors[field.name];
            const isValid = validFields.has(field.name);
            return (
              <div key={field.name}>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  {field.label}
                </label>
                <div className="relative">
                  <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" aria-hidden="true" />
                  <input
                    id={field.name}
                    {...register(field.name)}
                    type={field.type}
                    placeholder={field.placeholder}
                    aria-invalid={hasError || undefined}
                    aria-describedby={hasError ? field.errorId : undefined}
                    className={`w-full pl-10 pr-10 py-3 rounded-lg border-2 transition-all outline-none ${
                      hasError
                        ? 'border-error-500 focus:border-error-600 focus:ring-2 focus:ring-error-200'
                        : isValid
                        ? 'border-success-500 focus:border-success-600 focus:ring-2 focus:ring-success-200'
                        : 'border-gray-200 focus:border-primary-600 focus:ring-2 focus:ring-primary-200'
                    }`}
                  />
                  {/* Inline validation checkmark - #10 */}
                  {isValid && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      <Check className="w-5 h-5 text-success-500" />
                    </motion.div>
                  )}
                </div>
                {hasError && (
                  <motion.p
                    id={field.errorId}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-error-600 mt-1"
                    role="alert"
                  >
                    {errors[field.name]?.message}
                  </motion.p>
                )}
              </div>
            );
          })}
        </div>

        {/* Special Instructions */}
        <div>
          <label
            htmlFor="specialInstructions"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Special Instructions (Optional)
          </label>
          <div className="relative">
            <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-gray-400" aria-hidden="true" />
            <textarea
              id="specialInstructions"
              {...register('specialInstructions')}
              placeholder="Any special requests or instructions for our team..."
              rows={4}
              className="w-full pl-10 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary-600 focus:ring-2 focus:ring-primary-200 transition-all outline-none resize-none"
            />
          </div>
        </div>
      </form>
    </div>
  );
}
