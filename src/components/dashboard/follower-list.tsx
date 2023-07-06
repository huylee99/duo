import Image from "next/image";
import { Button } from "../ui/button";

const FollowerList = () => {
  return (
    <div className="grid grid-cols-6 gap-4">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(item => (
        <div key={item} className="col-span-1 flex flex-col gap-2 items-center rounded-lg border p-4">
          <Image src={"/avatar.jpg"} width={64} height={64} alt="avatar" className="w-16 h-16 rounded-full aspect-square object-cover" />
          <h3 className="text-primary font-medium">Huy Le</h3>
          <div className="flex items-center gap-4">
            <Button variant={"secondary"} className="h-8">
              Xóa
            </Button>
            {item % 2 === 0 && (
              <Button variant={"ghost"} className="h-8 text-pink-600 hover:text-pink-600">
                Theo dõi
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FollowerList;
