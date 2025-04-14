import "../Css/AllBlogs.css";
import image1 from "../assets/Dragon.png";
export default function PostCard({cardData}) {
  console.log(cardData)
 /*  const {EditedTime,PostId,PostedTime,Status,Thumbnail,editerUserId,postedByName,postedByUserId,_id} = cardData */
  return (
    <div className="allBlogsParent">
      <div className="optionsForAllBlogs"></div>

      <div className="allPostChild">
        {/* //main card */}

        <div
          style={{
            background: `url("${image1}") center no-repeat`,
            backgroundSize: "cover",
          }}
          className="allBlogsCards"
        >
          <div
            className="postThumbnail"
            style={{
              background: `url("${image1}") center no-repeat`,
              backgroundSize: "cover",
            }}
          ></div>
          <div className="postAllContent">
            <div className="postStatusBar">
              <div className="isActiveStatus">
                <div className="activeGreenBlink"></div>
                <span>Active</span>
              </div>
              <div className="seoScoreBar">
                {/* post views and seo score  */}
                <div className="postViews">
                  <span>18K</span>
                  <p>Views</p>
                </div>

                <div className="linePartition"></div>

                <div className="postSeoScore">
                  <span>98</span>
                  <p>Seo Score</p>
                </div>

                {/* post views and seo score end */}
              </div>
            </div>
            {/* post Description */}

            <div className="postDesc">
              <p>
                The world is full of beauty, from natural wonders like mountains
                Okay this is worklike
              </p>
            </div>
            {/* post Description end */}

            {/* post Details  */}

            <div className="postAllDetail">
              <div className="halfPostData">
                {[
                  "Posted By",
                  "Posted Date",
                  "Status",
                  "Edited By",
                  "Edited date",
                ].map((item, index) => {
                  return (
                    <>
                      {" "}
                      <div className="allDetailFirstPart">
                        {item} : NAN
                      </div>{" "}
                    </>
                  );
                })}
              </div>
              <div className="halfPostData">
                {[
                  "Scheduled Date",
                  "Scheduled Time",
                  "Post number",
                ].map((item, index) => {
                  return (
                    <>
                      {" "}
                      <div className="allDetailFirstPart">
                        {item} : NAN
                      </div>{" "}
                    </>
                  );
                })}
              </div>
            </div>
            {/* post Details end */}

            <div className="postAllHandelBtn">
              <button className="postHandelBtnEdit">Edit</button>
              <button className="postHandelBtnShedule">Reshedule</button>
              <button className="postHandelBtnEdit">Change Status</button>
              <button className="postHandelBtnDelete">Delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
