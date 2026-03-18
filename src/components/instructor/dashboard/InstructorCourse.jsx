import React, { useEffect, useState } from 'react';
import CourseCard from './instructorCourseComp/CourseCard';
import StatsCard from './instructorCourseComp/StatsCard';
import InstructorCourseListHeader from './instructorCourseComp/InstructorCourseListHeader';
import DeleteCourseAndLectureModal from './instructorCourseComp/modal/DeleteCourseAndLectureModal';
import UpdateCourseModal from './instructorCourseComp/modal/UpdateCourseModal';
import InstructorSpecificCourseDetails from './instructorCourseComp/specific-course-details/InstructorSpecificCourseDetails';
import { useDispatch, useSelector } from 'react-redux';
import { allCourse } from '../../../redux/slice/couseSlice';
import getSweetAlert from '../../../util/alert/sweetAlert';
import { Loader2 } from 'lucide-react';
import { getInstructorStudentCount } from '../../../function/getStudentCountBasedOnSpecificInstructor';
import { getInstructorTotalRevenue } from "../../../function/getTotalRevenueBasedonSpecificInstructor";
import { getInstructorAverageRating } from "../../../function/getAvgRatingBasedonSpecificInstructor";

const InstructorCourse = () => {
  
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [expandedSections, setExpandedSections] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [deletedData, setDeletedData] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [studentCount, setStudentCount] = useState(0),
    [totalRevenue, setTotalRevenue] = useState(0),
    [avgRating, setAvgRating] = useState(0.0);

  const deleteType = 'course';

  const [courses, setCourses] = useState([
    { id: 1, title: "Advanced React & Redux Masterclass", thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=225&fit=crop", students: 1234, revenue: 15420, rating: 4.8, totalLessons: 35, duration: "12h 30m", status: "published" },
    { id: 2, title: "Full Stack Web Development Bootcamp", thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=225&fit=crop", students: 856, revenue: 10272, rating: 4.5, totalLessons: 36, duration: "18h 45m", status: "published" },
    { id: 3, title: "UI/UX Design Fundamentals", thumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=225&fit=crop", students: 2103, revenue: 25236, rating: 4.9, totalLessons: 24, duration: "8h 20m", status: "published" },
    { id: 4, title: "Python for Data Science", thumbnail: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&h=225&fit=crop", students: 543, revenue: 6516, rating: 4.7, totalLessons: 42, duration: "15h 10m", status: "draft" }
  ]);


  const dispatch = useDispatch(),
    { isUserLoading, userAuthData, userError } = useSelector(state => state.checkAuth),
    { isCourseLoading, getCourseData, isCourseError } = useSelector(state => state.course);

  useEffect(() => {
    dispatch(allCourse({ instructor_id: userAuthData?.id }))
      .then(res => {
        // console.log('Response for fetching instructorwise course', res);
      })
      .catch(err => {
        console.log('Error occured', err);
        getSweetAlert("Error", "Something went wrong.", "error");
      })
  }, [dispatch]);

  useEffect(() => {
    const loadStudentCount = async () => {
      const count = await getInstructorStudentCount(userAuthData?.id);
      setStudentCount(count);
    };

    loadStudentCount();
  }, [userAuthData?.id]);

  useEffect(() => {
    const loadRevenue = async () => {
      const total = await getInstructorTotalRevenue(userAuthData?.id);
      setTotalRevenue(total);
    };

    loadRevenue();
  }, [userAuthData?.id]);

  useEffect(() => {
    const loadAvgRating = async () => {
      const rating = await getInstructorAverageRating(userAuthData?.id);
      setAvgRating(rating);
    };

    loadAvgRating();
  }, [userAuthData?.id]);

  // console.log('Get course details', getCourseData);

  if (selectedCourse) {

    return (
      <InstructorSpecificCourseDetails selectedCourse={selectedCourse} setSelectedCourse={setSelectedCourse} setExpandedSections={setExpandedSections} setEditForm={setEditForm} setShowDeleteModal={setShowDeleteModal}
        editForm={editForm} expandedSections={expandedSections} />
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <InstructorCourseListHeader />
        </div>

        <div className="grid grid-cols-4 gap-6 mb-8">
          <StatsCard courses={courses} getCourseData={getCourseData} studentCount={studentCount} totalRevenue={totalRevenue} avgRating={avgRating} />
        </div>

        {isCourseLoading ? (
          <Loader2 className='w-15 h-15 animate-spin mx-auto' />
        ) :
          (<div className="grid grid-cols-3 gap-6">
            {getCourseData?.map(course => <CourseCard key={course.id} course={course} setDeletedData={setDeletedData} setSelectedCourse={setSelectedCourse} setExpandedSections={setExpandedSections} setEditForm={setEditForm} setShowEditModal={setShowEditModal} setShowDeleteModal={setShowDeleteModal} />)}
          </div>
          )}
      </div>

      {/* Delete Course Modal */}
      {showDeleteModal && (
        <DeleteCourseAndLectureModal setShowDeleteLectureModal={setShowDeleteModal} deletedData={deletedData} deleteType={deleteType} onDeleted={() => setSelectedCourse(null)} />
      )}

      {/* Edit Course Modal */}
      {showEditModal && (
        <UpdateCourseModal setShowEditModal={setShowEditModal} editForm={editForm} setEditForm={setEditForm} />
      )}
    </div>
  );
};

export default InstructorCourse;