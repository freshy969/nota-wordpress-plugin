jQuery(function ($) {
  $("#nota-tools-run").click(function (e) {
    e.preventDefault();
    $.post(notaTools.ajaxUrl, {
      action: "nota_action",
      nota_action: "get_text_summary",
      nonce: notaTools.nonce,
      // get the edited content
      // note that this will remove line-breaks etc
      // maybe we're better to send off our HTML and parse it for text content first or something...
      text: wp.data.select("core/editor").getEditedPostContent(),
    })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (err) {
        console.log(err);
      });
  });
});
