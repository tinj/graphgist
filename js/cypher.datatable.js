'use strict';

function convertResult( data )
{
  var charWidth = 8;
  var result = {
    columns : [],
    data : []
  };
  var columns = data.columns;
  var count = columns.length;
  var rows = data.json.length;
  for ( var col = 0; col < count; col++ )
  {
    result.columns[col] = {
      "sTitle" : columns[col],
      sWidth : columns[col].length * charWidth
    };
  }
  for ( var row = 0; row < rows; row++ )
  {
    var currentRow = data.json[row];
    var newRow = [];
    for ( var col = 0; col < count; col++ )
    {
      var value = convertCell( currentRow[columns[col]] );
      newRow[col] = value;
      result.columns[col].sWidth = Math.max( value.length * charWidth, result.columns[col].sWidth );
    }
    result.data[row] = newRow;
  }
  var width = 0;
  for ( var col = 0; col < count; col++ )
  {
    width += result.columns[col].sWidth;
  }
  // var windowWith = $( window ).width() / 2;
  for ( var col = 0; col < count; col++ )
  {
    // result.columns[col].sWidth=windowWith * result.columns[col].sWidth / width;
    result.columns[col].sWidth = "" + Math.round( 100 * result.columns[col].sWidth / width ) + "%";
    // console.log(result.columns[col].sWidth);
  }
  return result;
}

function convertCell( cell )
{
  if ( cell == null )
  {
    return "<null>";
  }
  if ( cell instanceof Array )
  {
    var result = [];
    for ( var i = 0; i < cell.length; i++ )
    {
      result.push( convertCell( cell[i] ) );
    }
    return "[" + result.join( ", " ) + "]";
  }
  if ( cell instanceof Object )
  {
    if ( cell["_type"] )
    {
      return "(" + cell["_start"] + ")-[" + cell["_id"] + ":" + cell["_type"] + props( cell ) + "]->(" + cell["_end"]
          + ")";
    }
    else
    {
      var labels = "";
      if ( cell["_labels"] )
      {
        labels = ":" + cell["_labels"].join( ":" );
      }
      return "(" + cell["_id"] + labels + props( cell ) + ")";
    }
  }
  return cell;
}

function props( cell )
{
  var props = [];
  for ( key in cell )
  {
    if ( cell.hasOwnProperty( key ) && key[0] != '_' )
    {
      props.push( [ key ] + ":" + JSON.stringify( cell[key] ) );
    }
  }
  return props.length ? " {" + props.join( ", " ) + "}" : "";
}

function renderTable( element, data )
{
  if ( !data || !'stats' in data || !'rows' in data.stats )
  {
    return;
  }
  var result = convertResult( data );
  var table = $( '<table cellpadding="0" cellspacing="0" border="0" width="100%"></table>' ).appendTo( $( element ) );
  // console.log(1);
  var large = result.data.length > 10;
  var dataTable = table.dataTable( {
    aoColumns : result.columns,
    bFilter : large,
    bInfo : large,
    bLengthChange : large,
    bPaginate : large,
    aaData : result.data,
    // bAutoWidth: true,
    aLengthMenu : [ [ 10, 25, 50, -1 ], [ 10, 25, 50, "All" ] ],
    aaSorting : [],
    bSortable : true,
    oLanguage : {
      oPaginate : {
        sNext : " >> ",
        sPrevious : " << "
      }
    }
  } );
}
