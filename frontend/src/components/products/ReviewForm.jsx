import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useCreateReviewMutation } from '../../redux/api/productApi';
import { StarInput } from '../ui/StarRating';

export default function ReviewForm({ productId, onSuccess }) {
  const [rating, setRating] = useState(0);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [createReview, { isLoading }] = useCreateReviewMutation();

  const onSubmit = async (data) => {
    if (!rating) {
      toast.error('Please select a rating');
      return;
    }
    try {
      await createReview({ id: productId, rating, comment: data.comment }).unwrap();
      toast.success('Review submitted!');
      reset();
      setRating(0);
      if (onSuccess) onSuccess();
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to submit review');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Your Rating</label>
        <StarInput value={rating} onChange={setRating} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Your Review</label>
        <textarea
          {...register('comment', { required: 'Please write a review', minLength: { value: 10, message: 'Review must be at least 10 characters' } })}
          rows={4}
          placeholder="Share your experience with this product..."
          className={`input resize-none ${errors.comment ? 'input-error' : ''}`}
        />
        {errors.comment && <p className="text-red-500 text-xs mt-1">{errors.comment.message}</p>}
      </div>
      <button type="submit" disabled={isLoading} className="btn-primary px-6 py-2">
        {isLoading ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
}
