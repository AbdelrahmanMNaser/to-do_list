import Card from '../ui/Card';

const ProfileSection = ({ title, children, icon }) => (
  <Card className="mb-6" padding="normal">
    <div className="flex items-center mb-4">
      <div className="p-2 rounded-full bg-blue-50 text-blue-600 mr-3">
        {icon}
      </div>
      <h2 className="text-xl font-semibold">{title}</h2>
    </div>
    <div className="pl-10">
      {children}
    </div>
  </Card>
);

export default ProfileSection;