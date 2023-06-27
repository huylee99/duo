import { useSession } from "next-auth/react";
import { NextPageWithLayout } from "./_app";
import CommonLayout from "~/layout/common-layout";
import { useUpload } from "~/hooks/use-upload";
import { useRef } from "react";
import { toast } from "react-hot-toast";
import Image from "next/image";

const Home: NextPageWithLayout = () => {
  const { data } = useSession();
  const fileRef = useRef<HTMLInputElement>(null);

  const { uploadFiles } = useUpload({
    allowedFileTypes: ["image/png", "image/jpeg"],
    maxFileSize: 5 * 1024 * 1024,
    onError() {
      toast.error("Lỗi");
    },
    onUploadCompleted: () => {
      toast.success("Upload completed");
    },
    onSettled() {
      if (fileRef.current) {
        fileRef.current.value = "";
      }
    },
  });

  return (
    <div>
      <input
        type="file"
        multiple
        ref={fileRef}
        onChange={async event => {
          if (!event.target.files) return;

          const files = Array.from(event.target.files);

          const result = await uploadFiles(files);

          console.log(result);
        }}
      />
      {/* <Image src={"https://cloud.deuxlabs.dev/pexels-christian-heitz-842711.jpg"} alt="test" fill priority unoptimized /> */}
    </div>
  );
};

Home.getLayout = (page: React.ReactElement) => {
  return <CommonLayout>{page}</CommonLayout>;
};

export default Home;
