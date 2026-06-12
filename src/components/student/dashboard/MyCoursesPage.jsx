import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import getSweetAlert from '../../../util/alert/sweetAlert';
import StudentMyCourseStats from './student-myCourse/StudentMyCourseStats';
import { fetchUserPurchase } from '../../../redux/slice/purchaseSlice';
import CourseCard from './student-myCourse/CourseCard';
import ActiveCourse from './student-myCourse/ActiveCourse';

const MyCoursesPage = ({ userData }) => {
  const [selectedCourse, setSelectedCourse] = useState(null);

  const dispatch = useDispatch(),
    { userAuthData } = useSelector(state => state.checkAuth),
    { isPurchaseLoading, getPurchaseData, hasPurchaseError } = useSelector(state => state.purchase);

  const purchaseItems = getPurchaseData?.flatMap(order => order.purchase_items.map(item => ({
    ...item?.courses,
    purchase_item_id: item?.id
  }))) || [];

  useEffect(() => {
    if (userAuthData) {
      dispatch(fetchUserPurchase({ userId: userAuthData?.id, status: 'paid' }))
        .then(res => {
          // console.log('Response for fetching user profile', res);
        })
        .catch((err) => {
          // console.log("Error occurred", err);
          getSweetAlert('Oops...', 'Something went wrong!', 'error');
        });
    }

    const specificCourseStr = sessionStorage.getItem('openSpecificCourse');
    if (specificCourseStr) {
      try {
        const course = JSON.parse(specificCourseStr);
        setSelectedCourse(course);
      } catch (e) {
        console.error("Failed to parse specific course", e);
      }
      sessionStorage.removeItem('openSpecificCourse');
    }
  }, [userAuthData]);

  // console.log('Purchased course list', purchaseItems);

  if (selectedCourse) {
    return (
      <ActiveCourse setSelectedCourse={setSelectedCourse} selectedCourse={selectedCourse} getPurchaseData={getPurchaseData} />
    )
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">My Courses</h1>
          <p className="text-gray-400">Continue your learning journey</p>
        </div>

        <StudentMyCourseStats purchaseItems={purchaseItems} userAuthData={userAuthData} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {purchaseItems?.length > 0 ? purchaseItems?.map(course => (
            <CourseCard key={course?.id} course={course} setSelectedCourse={setSelectedCourse} userData={userData} />
          )) : <p className='text-center py-4 col-span-full'>No course available</p>}
        </div>
      </div>
    </div>
  );
};

export default MyCoursesPage;