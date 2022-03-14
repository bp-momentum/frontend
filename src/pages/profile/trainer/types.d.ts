/**
 * Wrapper for a trainer's contact information returned by {@link Routes.getTrainerContact()}.
 */
interface TrainerContact {
  name: string;
  email: string;
  telephone: string;
  academia: string;
  street: string;
  city: string;
  country: string;
  house_nr: string;
  address_addition: string;
  postal_code: string;
}
