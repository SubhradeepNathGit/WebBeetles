export const getStarCount = (review) => {

    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

    review?.forEach(rating => {
        if (counts[rating?.rating_count] !== undefined) {
            counts[rating?.rating_count] += 1;
        }
    });

    const total = review?.length || 0;

    return [counts, total];
};