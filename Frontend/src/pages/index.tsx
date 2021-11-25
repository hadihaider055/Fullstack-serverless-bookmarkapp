import React, { useState, useEffect } from 'react'
import DataComponent from '../components/data'
import ErrorComponent from "../components/error";
import LoadingComponent from "../components/loading";
import LoaderSvg from "../components/loaderSvg";
import { API } from "aws-amplify"
import { createBookmark, updateBookmark, deleteBookmark } from '../graphql/mutations'
import shortid from 'shortid'
import { getBookmarks } from '../graphql/queries'



interface bookmarkType {
  data: {
    getBookmarks: [
      {
        id: string
        title: string
        description: string
        url: string
      }
    ]
  }
}

interface bookmarkData {
  id: string
  title: string
  url: string
  description: string
}

const Home = () => {
  const [toggleBtn, setToggleBtn] = useState(false);
  const [btnDisable, setBtnDisable] = useState(false);
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [bookmarkData, setBookmarkData] = useState({
    id: "",
    title: "",
    url: "",
    description: "",
  });
  const [bookmarks, setBookmarks] = useState<bookmarkType | null>(null);


  const fetchApi = async () => {
    try {
      const data = await API.graphql({ query: getBookmarks })
      setBookmarks(data as bookmarkType)
    } catch (err) {
      setError(err)
    }
    setLoading(false)
  }

  const addBookmark = async (e) => {
    e.preventDefault();
    try {
      const bookmark = {
        id: shortid.generate(),
        title: bookmarkData.title,
        url: bookmarkData.url,
        description: bookmarkData.description,
      }
      if (toggleBtn === false) {
        setBtnDisable(true);
        const data = await API.graphql({
          query: createBookmark,
          variables: {
            bookmark
          }
        })
        setBtnDisable(false);
      } else {
        setBtnDisable(true);
        const data = await API.graphql({
          query: updateBookmark,
          variables: {
            bookmark: bookmarkData,
          }
        })
        setBtnDisable(false);
      }
      setBookmarkData({
        id: "",
        title: "",
        url: "",
        description: "",
      });
      setToggleBtn(false);
      fetchApi()
    } catch (e) {
      setError(e)
    }
  }

  const handleEdit = async (bookmark: bookmarkData) => {
    try {
      setBookmarkData({
        id: bookmark.id,
        title: bookmark.title,
        url: bookmark.url,
        description: bookmark.description,
      })
      setToggleBtn(true);
    } catch (error) {
      setError(error)
    }
  }


  const handleDelete = async (id: string) => {
    try {
      const data = await API.graphql({
        query: deleteBookmark,
        variables: {
          bookmarkId: id
        }
      })
      fetchApi()
    } catch (err) {
      setError(err)
    }
  }

  useEffect(() => {
    fetchApi()
  }, [])


  if (loading) return <LoadingComponent />;

  if (error) return <ErrorComponent />;

  return (
    <>
      <div className="flex justify-between mx-auto h-screen w-screen mt-10 md:mt-0 flex-wrap">
        <div className="w-72 shadow-lg  p-8 md:p-10 bg-white h-110 mt-24 mx-auto md:w-90">
          <h1 className="text-center text-4xl font-pacifico m-3">
            Bookmark App
          </h1>
          <div className="mt-10 mx-auto text-center">
            <form onSubmit={addBookmark} className="mx-auto">
              <input
                type="text"
                className="border block w-56 md:w-72 p-2 rounded-sm border-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-700 shadow-sm my-2 bg-transparent font-montserrat tracking-wider"
                placeholder="Title"
                onChange={(e) =>
                  setBookmarkData({ ...bookmarkData, title: e.target.value })
                }
                value={bookmarkData.title}
              />
              <input
                type="url"
                className="border block w-56 md:w-72 p-2 rounded-sm border-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-700 shadow-sm my-2 bg-transparent font-montserrat tracking-wider"
                placeholder="Url"
                onChange={(e) =>
                  setBookmarkData({ ...bookmarkData, url: e.target.value })
                }
                required
                value={bookmarkData.url}
              />
              <textarea
                className="border block w-56 md:w-72 p-2 rounded-sm border-purple-700 focus:outline-none focus:ring-1 h-24 resize-none focus:ring-purple-700 shadow-sm my-2 bg-transparent font-montserrat tracking-wider"
                placeholder="Description"
                onChange={(e) =>
                  setBookmarkData({
                    ...bookmarkData,
                    description: e.target.value,
                  })
                }
                value={bookmarkData.description}
              />
              <button
                type="submit"
                className=" block w-56 md:w-72 p-2 rounded-sm bg-purple-700 text-white hover:bg-purple-800 hover:shadow-lg transition-all duration-500 ease-in-out  focus:outline-none focus:ring-1 focus:ring-purple-700 shadow-sm my-2 bg-transparent font-montserrat tracking-wider"
                disabled={btnDisable}
              >
                {toggleBtn ? "Edit" : "Create"}
                {btnDisable ? <LoaderSvg /> : ""}
              </button>
            </form>
          </div>
        </div>
        <div className="border border-gray-300 mt-32 h-96 rounded-lg"></div>
        <DataComponent
          bookmarks={bookmarks}
          handleDelete={handleDelete}
          handleEdit={handleEdit}
        />
      </div>
    </>
  )
}

export default Home