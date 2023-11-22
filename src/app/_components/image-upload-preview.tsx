export function ImageUploadPreview({ file, onDelete }: { file: File; onDelete: () => void }) {
    return (
      <div id="image-template">
        <li className="block p-1 w-full h-20">
          <article tabIndex={0} className="group hasImage w-full h-full rounded-md focus:outline-none focus:shadow-outline bg-gray-100 cursor-pointer relative text-transparent hover:text-white shadow-sm">
            <img alt="Image preview" className="img-preview w-full h-full sticky object-cover rounded-md bg-fixed" src={URL.createObjectURL(file)} />
  
            <section className="flex flex-col rounded-md text-xs break-words w-full h-full z-20 absolute top-0 py-2 px-3">
              <h1 className="flex-1">{file.name}</h1>
              <div className="flex">
                <span className="p-1"></span>
                <p className="p-1 size text-xs"></p>
                <button
                  onClick={onDelete}
                  className="delete ml-auto focus:outline-none hover:bg-[#fc571a] p-1 rounded-md"
                >
                  <svg
                    className="pointer-events-none fill-current w-4 h-4 ml-auto"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <path className="pointer-events-none" d="M3 6l3 18h12l3-18h-18zm19-4v2h-20v-2h5.711c.9 0 1.631-1.099 1.631-2h5.316c0 .901.73 2 1.631 2h5.711z" />
                  </svg>
                </button>
              </div>
            </section>
          </article>
        </li>
      </div>
    );
  }