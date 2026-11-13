"use client";
import { useEffect, useState, type SubmitEvent } from "react";

interface INote {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export default function Home() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [notes, setNotes] = useState<INote[]>([]);
  const [editingID, setEditingID] = useState<string>("");

  const fetchNotes = async () => {
    try {
      const res = await fetch("/api/notes");
      const data = await res.json();
      setNotes(data);
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchNotes();
  }, []);

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title || !content) {
      alert("Please fill in all fields");
      return;
    }

    try {
      setIsLoading(true);
      if (editingID) {
        const res = await fetch(`/api/notes/${editingID}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title, content }),
        });

        if (res.ok) {
          fetchNotes();
          alert("Note updated successfully👌");
          setTitle("");
          setContent("");
          setEditingID("");
        }
      } else {
        const res = await fetch("/api/notes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title, content }),
        });

        if (res.ok) {
          fetchNotes();
          alert("Note created successfully👌");
          setTitle("");
          setContent("");
          setEditingID("");
        }
      }
    } catch (error) {
      console.log("Error saving data", error);
      alert("Error saving Note");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = async (note: INote) => {
    setEditingID(note._id);
    setTitle(note.title);
    setContent(note.content);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;

    try {
      const res = await fetch(`/api/notes/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchNotes();
      }
    } catch (error) {
      console.error("Error deleting note:", error);
      alert("Error deleting note");
    }
  };

  const handleCancel = async () => {
    setEditingID("");
    setTitle("");
    setContent("");
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div>
          <h1 className="text-4xl font-bold text-amber-500 mb-2">My Notes</h1>
          <p className="text-zinc-400">
            Create, Read, Update and Delete your Notes
          </p>
        </div>

        {/* Form */}
        <div className="bg-gray-950 rounded-lg shadow-md p-6 mb-8 border border-gray-800">
          <form onSubmit={(e) => handleSubmit(e)}>
            <div>
              <label className="block text-lg font-medium text-yellow-400 mb-2">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter the title of your Note..."
                className="w-full mb-4 px-4 py-2 border border-gray-700 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 placeholder-gray-500"
              />
            </div>
            <div>
              <label className="block text-lg font-medium text-yellow-400 mb-2">
                Content
              </label>
              <textarea
                rows={5}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter your Note..."
                className="w-full px-4 py-2 border border-gray-700 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 placeholder-gray-500"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-yellow-500 text-gray-900 py-2 px-4 mt-2 rounded-sm hover:bg-yellow-600 disabled:bg-gray-600 transition font-semibold"
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : editingID ? "Edit Note" : "Add Note"}
              </button>
              {editingID && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-gray-700 text-white py-2 px-4 mt-2 rounded-sm hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {notes.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg">
                No notes yet. Create one to get started!
              </p>
            </div>
          ) : (
            notes.map((note) => (
              <div
                key={note._id}
                className="bg-gray-900 rounded-lg shadow-md p-6 border border-gray-800"
              >
                <h2 className="text-xl font-semibold text-yellow-400 mb-2">
                  {note.title}
                </h2>
                <p className="text-gray-300 mb-4 line-clamp-3">
                  {note.content}
                </p>
                <p className="text-sm text-gray-500 mb-2">
                  Created At: {new Date(note.createdAt).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  Updated At: {new Date(note.updatedAt).toLocaleDateString()}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(note)}
                    className="flex-1 bg-yellow-500 text-gray-900 py-1 px-3 rounded hover:bg-yellow-600 transition text-sm font-semibold"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(note._id)}
                    className="flex-1 bg-red-600 text-white py-1 px-3 rounded hover:bg-red-700 transition text-sm font-semibold"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
